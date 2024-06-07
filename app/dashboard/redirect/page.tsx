import { isDevelopment } from "@/utils";
import { redirect } from "next/navigation";

const page = () => {
  const protocol = isDevelopment ? "http" : "https";

  return redirect(
    `${protocol}://${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
      process.env.NEXT_PUBLIC_VERCEL_ENV ||
      ""
    }`
  );
};

export default page;
