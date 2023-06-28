// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SwapERC20 Contract
 * @notice Swap any supported ERC20 for another
 * @author HorizenLabs
 */
contract SwapERC20 is Ownable, Pausable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    /// @notice Allowed state of a swap instance
    enum State {
        BEGUN,
        FINISHED,
        CANCELLED
    }

    /// @notice A swap instance
    struct Instance {
        uint256 id;
        address initiator;
        address initiatorERC20;
        uint256 initiatorAmount;
        address counterParty;
        address counterPartyERC20;
        uint256 counterPartyAmount;
        State state;
    }

    /// @notice Global counter used to id each swap instance
    Counters.Counter private instanceId;

    mapping(address => Instance[]) public initiatorInstances;
    mapping(address => Instance[]) public counterPartyInstances;

    /// @notice Map of all supported ERC20 tokens
    mapping(IERC20 => bool) public supportedErc20s;
    IERC20[] public erc20s;

    /// @notice Addresses of ERC20 tokens that won't need the owner fee
    mapping(IERC20 => bool) public noOwnerFeeERC20s;
    /// @notice Address that will receive the owner fee
    address public ownerFeeAddress;
    /// @notice Amount in permille (i.e. 12 -> 12/1000 -> 1.2%) of the owner fee
    uint256 public ownerFeePermille = 12;

    event Begun(
        uint256 indexed id,
        address indexed initiator,
        address indexed counterParty
    );
    event Cancelled(uint256 indexed id);
    event Finished(uint256 indexed id);
    event NoOwnerFeeERC20Changed(IERC20 indexed _token, bool indexed _newValue);
    event OwnerFeeAddressChanged(address indexed _address);
    event OwnerFeePermilleChanged(uint256 indexed _feePermille);

    error InvalidAddress();
    error InvalidAmount();
    error InsufficientFee();
    error InvalidState();
    error Unauthorized();
    error UnsupportedERC20();
    error TransferError();

    /**
     * @notice Construct a new Swap contract
     * @param _ownerFeeAddress Address that will receive owner fee
     * @param _ownerFeePermille Fee permille millis that will be received by owner. i.e. 12 -> 12/1000 -> 1.2%
     */
    constructor(address _ownerFeeAddress, uint256 _ownerFeePermille) {
        if (_ownerFeeAddress == address(0)) revert InvalidAddress();
        ownerFeeAddress = _ownerFeeAddress;
        ownerFeePermille = _ownerFeePermille;
    }

    /**
     * @notice Begin an ERC20 swap between two parties
     * @param initiatorERC20 ERC20 contract address for the initiator
     * @param initiatorAmount Amount of ERC20 tokens the initiator is depositing
     * @param counterPartyERC20 ERC20 contract address for the counterParty
     * @param counterPartyAmount Amount of ERC20 tokens the counterParty is depositing
     * @param counterParty Address of the counterParty
     */
    function begin(
        address initiatorERC20,
        uint256 initiatorAmount,
        address counterPartyERC20,
        uint256 counterPartyAmount,
        address counterParty
    ) external payable whenNotPaused {
        if (initiatorAmount == 0 || counterPartyAmount == 0)
            revert InvalidAmount();
        if (counterParty == address(0)) revert InvalidAddress();
        if (!supportedErc20s[IERC20(initiatorERC20)]) revert UnsupportedERC20();
        if (!supportedErc20s[IERC20(counterPartyERC20)])
            revert UnsupportedERC20();

        // Transfer initiator's ERC20 tokens to contract.
        IERC20 erc20 = IERC20(initiatorERC20);
        if (!erc20.transferFrom(msg.sender, address(this), initiatorAmount)) {
            revert TransferError();
        }

        instanceId.increment();
        Instance memory instance = Instance({
            id: instanceId.current(),
            initiator: msg.sender,
            initiatorERC20: initiatorERC20,
            initiatorAmount: initiatorAmount,
            counterParty: counterParty,
            counterPartyERC20: counterPartyERC20,
            counterPartyAmount: counterPartyAmount,
            state: State.BEGUN
        });

        initiatorInstances[msg.sender].push(instance);
        counterPartyInstances[counterParty].push(instance);

        emit Begun(instanceId.current(), msg.sender, counterParty);
    }

    function cancel(uint256 id) external whenNotPaused {
        if (initiatorInstances[msg.sender].length == 0) revert Unauthorized();

        // Cancel Initiator's Instance
        for (uint256 i = 0; i < initiatorInstances[msg.sender].length; ++i) {
            if (initiatorInstances[msg.sender][i].id == id) {
                Instance storage i_instance = initiatorInstances[msg.sender][i];

                if (i_instance.initiator != msg.sender) revert Unauthorized();
                if (i_instance.state != State.BEGUN) revert InvalidState();
                i_instance.state = State.CANCELLED;

                // Cancel CounterParty's Instance
                for (
                    uint256 j = 0;
                    j < counterPartyInstances[i_instance.counterParty].length;
                    ++j
                ) {
                    if (
                        counterPartyInstances[i_instance.counterParty][j].id ==
                        id
                    ) {
                        Instance storage c_instance = counterPartyInstances[
                            i_instance.counterParty
                        ][j];
                        c_instance.state = State.CANCELLED;

                        // Return tokens to initiator
                        IERC20 initiatorERC20 = IERC20(
                            i_instance.initiatorERC20
                        );
                        require(
                            initiatorERC20.transfer(
                                i_instance.initiator,
                                i_instance.initiatorAmount
                            )
                        );

                        emit Cancelled(i_instance.id);

                        break;
                    }
                }

                break;
            }
        }
    }

    function complete(uint256 id) external whenNotPaused {
        if (counterPartyInstances[msg.sender].length == 0)
            revert Unauthorized();

        for (uint256 i = 0; i < counterPartyInstances[msg.sender].length; ++i) {
            if (counterPartyInstances[msg.sender][i].id == id) {
                // Complete CounterParty's Instance
                Instance storage c_instance = counterPartyInstances[msg.sender][
                    i
                ];

                if (c_instance.counterParty != msg.sender)
                    revert Unauthorized();
                if (c_instance.state != State.BEGUN) revert InvalidState();
                c_instance.state = State.FINISHED;

                // Complete Initiator's Instance
                for (
                    uint256 j = 0;
                    j < initiatorInstances[c_instance.initiator].length;
                    ++j
                ) {
                    if (initiatorInstances[c_instance.initiator][j].id == id) {
                        Instance storage i_instance = initiatorInstances[
                            c_instance.initiator
                        ][j];
                        i_instance.state = State.FINISHED;

                        IERC20 counterPartyERC20 = IERC20(
                            c_instance.counterPartyERC20
                        );
                        // Transfer fee (counterParty)
                        uint256 counterPartyFee; // = 0, default
                        if (!noOwnerFeeERC20s[counterPartyERC20]) {
                            counterPartyFee =
                                (c_instance.counterPartyAmount *
                                    ownerFeePermille) /
                                1000;
                            if (
                                !counterPartyERC20.transferFrom(
                                    c_instance.counterParty,
                                    ownerFeeAddress,
                                    counterPartyFee
                                )
                            ) {
                                revert TransferError();
                            }
                        }
                        // Transfer tokens to initiator
                        if (
                            !counterPartyERC20.transferFrom(
                                c_instance.counterParty,
                                c_instance.initiator,
                                c_instance.counterPartyAmount - counterPartyFee
                            )
                        ) {
                            revert TransferError();
                        }

                        // Transfer fee (initiator)
                        IERC20 initiatorERC20 = IERC20(
                            c_instance.initiatorERC20
                        );
                        uint256 initiatorFee; // = 0, default
                        if (!noOwnerFeeERC20s[initiatorERC20]) {
                            initiatorFee =
                                (c_instance.initiatorAmount *
                                    ownerFeePermille) /
                                1000;
                            initiatorERC20.transfer(
                                ownerFeeAddress,
                                initiatorFee
                            );
                        }

                        //transfer tokens to counterparty
                        if (
                            !initiatorERC20.transfer(
                                c_instance.counterParty,
                                c_instance.initiatorAmount - initiatorFee
                            )
                        ) {
                            revert TransferError();
                        }

                        emit Finished(c_instance.id);

                        break;
                    }
                }

                break;
            }
        }
    }

    function findInstances(
        address _addr
    ) public view returns (Instance[] memory) {
        uint256 count = initiatorInstances[_addr].length +
            counterPartyInstances[_addr].length;
        Instance[] memory result = count > 0
            ? new Instance[](count)
            : new Instance[](0);

        uint256 offset = 0;
        for (uint256 i = 0; i < initiatorInstances[_addr].length; i++) {
            result[offset] = initiatorInstances[_addr][i];
            ++offset;
        }

        for (uint256 i = 0; i < counterPartyInstances[_addr].length; i++) {
            result[offset] = counterPartyInstances[_addr][i];
            ++offset;
        }

        return result;
    }

    /// @notice Pause all swaps
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice UnPause all swaps
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Add an ERC20 to supported list
     * @param _erc20 The contract address for a valid ERC20
     */
    function addERC20Support(IERC20 _erc20) external onlyOwner whenNotPaused {
        erc20s.push(_erc20);
        supportedErc20s[_erc20] = true;
    }

    function getSupportedErc20s() public view returns (IERC20[] memory) {
        return erc20s;
    }

    /**
     * @notice Change token that doesn't need to pay owner fee
     * @param _token token
     * @param _newValue boolean (true = don't pay, false = pay)
     */
    function changeNoOwnerFeeERC20(
        IERC20 _token,
        bool _newValue
    ) external onlyOwner {
        if (_token == IERC20(address(0))) revert InvalidAddress();

        noOwnerFeeERC20s[_token] = _newValue;
        emit NoOwnerFeeERC20Changed(_token, _newValue);
    }

    /**
     * @notice Set owner fee receiving address
     * @param _ownerFeeAddress address
     */
    function setOwnerFeeAddress(address _ownerFeeAddress) external onlyOwner {
        if (_ownerFeeAddress == address(0)) revert InvalidAddress();
        ownerFeeAddress = _ownerFeeAddress;

        emit OwnerFeeAddressChanged(ownerFeeAddress);
    }

    /**
     * @notice Set owner fee permille receiving address
     * @param _ownerFeePermille amount (i.e. 12 -> 12/1000 -> 1.2%)
     */
    function setOwnerFeePermille(uint256 _ownerFeePermille) external onlyOwner {
        ownerFeePermille = _ownerFeePermille;

        emit OwnerFeePermilleChanged(_ownerFeePermille);
    }
}
