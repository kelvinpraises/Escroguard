"use client";

import Navbar from "@/components/organisms/Navbar";
import store from "@/store";

const Header = () => {
  const address = store((state) => state.userAddress);

  return (
    <div className=" flex p-8 justify-between items-center">
      <p className=" font-semibold text-xl">Escrøguard</p>
      <Navbar />
      <div></div>
    </div>
  );
};

export default Header;
