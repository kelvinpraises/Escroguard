import BlackCard from "@/components/BlackCard";
import Header from "@/components/Header";
import SpentCard from "@/components/SpentCard";
import Transaction from "@/components/Transaction";

const page = () => {
  return (
    <div className=" flex flex-col">
      <Header />
      <div className=" flex flex-col p-8 gap-[128px]">
        <div className=" flex gap-[64px]">
          <SpentCard />

          <div className=" flex flex-wrap gap-8">
            {[
              { img: "SwapW.svg", name: "Swap" },
              { img: "Chat.svg", name: "Forum" },
              { img: "Info.svg", name: "About" },
              { img: "Setting.svg", name: "Settings" },
            ].map((item, i) => (
              <BlackCard img={item.img} name={item.name} />
            ))}
          </div>
        </div>
        <Transaction
          name={"Pending Transaction"}
          wallet={[
            {
              name: "My Wallet",
              date: "19 July 2023 07:21 AM",
              amount: "$100 USD",
              status: "Withdraw",
            },
            {
              name: "My Wallet",
              date: "19 July 2023 07:21 AM",
              amount: "$100 USD",
              status: "Transfer",
            }
          ]}
        />

        <Transaction
          name={"Transaction History"}
          wallet={[
            {
              name: "My Wallet",
              date: "19 July 2023 07:21 AM",
              amount: "$100 USD",
              status: "Withdraw",
            },
            {
              name: "My Wallet",
              date: "19 July 2023 07:21 AM",
              amount: "$100 USD",
              status: "Transfer",
            }
          ]}
        />
      </div>
    </div>
  );
};

export default page;
