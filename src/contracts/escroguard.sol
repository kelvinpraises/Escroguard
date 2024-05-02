pragma solidity ^0.8.0;

contract Escroguard {
    mapping(address => SwapERC20[]) public escroguardContracts;

    function deploySwap(
        address _ownerFeeAddress,
        uint256 _ownerFeePermille
    ) public {
        SwapERC20 newContract = new SwapERC20(
            _ownerFeeAddress,
            _ownerFeePermille
        );
        newContract.transferOwnership(_ownerFeeAddress);
        escroguardContracts[_ownerFeeAddress].push(newContract);
    }

    function findInstances(
        address _addr
    ) public view returns (SwapERC20[] memory) {
        uint256 count = escroguardContracts[_addr].length;

        SwapERC20[] memory result = count > 0
            ? new SwapERC20[](count)
            : new SwapERC20[](0);

        uint256 offset = 0;
        for (uint256 i = 0; i < escroguardContracts[_addr].length; i++) {
            result[offset] = escroguardContracts[_addr][i];
            ++offset;
        }

        return result;
    }
}
