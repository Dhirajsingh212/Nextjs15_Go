import { ProductList } from "@/components/Product";
import { BACEND_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function getProducts() {
  "use server";
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token"); // Replace 'token' with your cookie name

    // Prepare headers for the fetch request
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `token=${token.value}` } : {}),
    };
    const response = await fetch(`${BACEND_URL}/products`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await response.json();

    return data.data.products || [];
  } catch (err) {
    return [];
  }
}

export default async function Page() {
  const initialData = await getProducts();

  return <ProductList initialData={initialData} />;
}
