import { ProductList } from "@/components/Product";
import { BACEND_URL } from "@/lib/config";
import axios from "axios";

export async function getProducts() {
  try {
    const response = await axios.get(`${BACEND_URL}/products`, {
      withCredentials: true,
    });
    return response.data.data.products || [];
  } catch (err) {
    return [];
  }
}

export default async function Page() {
  const initialData = await getProducts();

  return <ProductList initialData={initialData} />;
}
