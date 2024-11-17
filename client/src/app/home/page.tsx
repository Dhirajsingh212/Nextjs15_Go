import { ProductList } from "@/components/Product";
import { BACEND_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function getProducts(page: number, searchText: string) {
  "use server";
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token"); // Replace 'token' with your cookie name

    // Prepare headers for the fetch request
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `token=${token.value}` } : {}),
    };
    const response = await fetch(
      `${BACEND_URL}/products?page=${page}&search=${searchText}`,
      {
        method: "GET",
        headers,
        credentials: "include",
      }
    );

    const data = await response.json();

    return data || {};
  } catch (_) {
    return {};
  }
}

export default async function Page({ searchParams }: any) {
  const page = (await searchParams).page;
  const searchText = (await searchParams).search;

  const initialData = await getProducts(page, searchText);

  return (
    <ProductList
      initialData={initialData.data}
      totalPages={initialData.totalPages}
    />
  );
}
