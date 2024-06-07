import { redirect } from "next/navigation";

const page = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const protocol = isDevelopment ? "http" : "https";

  return redirect(`${protocol}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || ""}`);
};

export default page;
