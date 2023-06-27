import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className=" flex p-8 justify-between items-center">
      <p className=" font-semibold text-xl">Escrøguard</p>
      <Navbar />
      <img src="/profile.svg" alt="" />
    </div>
  );
};

export default Header;
