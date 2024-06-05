import Link from "next/link";

const About = () => {
  return (
    <div className=" flex flex-col">
      <div className=" flex flex-col p-8 gap-8 h-[calc(100vh-124px)]">
        <div className=" flex items-center gap-4">
          <Link href={"/"}>
            <div className=" bg-[#F5F150] py-2 px-4 rounded-[5px]">
              <img src="/Arrow.svg" alt="" />
            </div>
          </Link>
          <p className=" text-[32px] font-semibold font-roboto">About</p>
        </div>

        <div className=" flex flex-col gap-8">
          <div className=" flex gap-4 items-center">
            <p className=" text-white font-medium text-xl">Name:</p>
            <p className=" text-white font-medium">Swappy v1</p>
          </div>

          <div className=" flex gap-4 items-center">
            <p className=" text-white font-medium text-xl">Contract:</p>
            <div className=" text-white font-medium flex gap-2">
              <p>0xB754369b3a7C430d7E94c14f33c097C398a0caa5</p>
              <img src="/LookUp.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
