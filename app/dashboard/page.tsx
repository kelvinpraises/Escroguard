import BlackCard from "@/components/molecules/BlackCard";
import SpentCard from "@/components/molecules/SpentCard";
import Transaction from "@/components/organisms/Transaction";

const Dashboard = () => {
  return (
    <div className=" flex flex-col">
      <div className=" flex flex-col p-8 gap-[128px]">
        <div className=" flex gap-[64px]">
          <SpentCard />

          <div className=" flex flex-wrap gap-8">
            {[
              { img: "SwapW.svg", name: "swap" },
              { img: "Chat.svg", name: "forum" },
              { img: "Info.svg", name: "about" },
              { img: "Setting.svg", name: "settings" },
            ].map((item, i) => (
              <BlackCard key={i} img={item.img} name={item.name} />
            ))}
          </div>
        </div>
        <Transaction
          name={"Pending Swaps"}
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
            },
          ]}
        />

        <Transaction
          name={"Swap History"}
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
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
