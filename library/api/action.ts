"use server";

export async function createSwap(prevState: any, formData: FormData) {
  const swapName = formData.get("swapName");
  const swapFee = formData.get("swapFee");

  console.log(swapName, swapFee);
  console.log(formData);
  return { message: "" };
}

export async function joinSwap(prevState: any, formData: FormData) {
  const swapId = formData.get("swapId");

  console.log(swapId);
  console.log(formData);
  return { message: "" };
}
