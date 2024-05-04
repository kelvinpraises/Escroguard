"use client";
import { store } from "../store/store";
import Navbar from "./Navbar";

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
