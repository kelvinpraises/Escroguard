import { UserOnboard } from "@/components/organisms/UserOnboard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-start h-screen">
      <div className="flex flex-col bg-white gap-24 p-8 h-full w-full">
        <p className="text-black text-xl font-semibold">Escrøguard</p>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-[#292929] font-semibold text-5xl">
              Own Your Swaps!
            </p>
            <p className="w-[726px] text-[#5B5B5B] text-xl text-center">
              Escrøguard puts you in the driver&apos;s seat, allowing you to
              take full control of your trades. Create a streamlined trading
              experience while enjoying the peace of mind that comes with true
              ownership. Connect your wallet to create, join, and view previous
              swaps.
            </p>
          </div>
          <UserOnboard />
        </div>
      </div>
      <div className="max-w-[450px] w-full flex h-full">
      {children}
      </div>
    </div>
  );
}
