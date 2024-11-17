"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Client Component for interactivity
export function ProductList({ initialData, totalPages }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const perPage = 10;
  const [searchText, setSearchText] = useState("");

  const updateQueryParams = (params: Record<string, string | number>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, String(value));
      } else {
        current.delete(key);
      }
    });
    const search = current.toString();
    console.log(search);
    const query = search ? `?${search}` : "";
    router.push(`/home${query}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/home?search=${searchText}`);
          }}
          className="flex-1 flex items-center"
        >
          <Input
            type="search"
            placeholder="Search products..."
            className="mr-2"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialData.map((product: any) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <Image
                src={
                  "https://i.pinimg.com/originals/2f/ab/f3/2fabf3ceb5a35b51a70e27137d56e4d2.gif"
                }
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="mb-2">{product.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <p className="text-lg font-semibold">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  updateQueryParams({ page: Math.max(1, page - 1) })
                }
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={() => updateQueryParams({ page: pageNum })}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  updateQueryParams({ page: Math.min(totalPages, page + 1) })
                }
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        {/* <p className="text-sm text-gray-600 mt-2">
          Showing {(page - 1) * perPage + 1} -{" "}
          {Math.min(page * perPage, totalProducts)} of {totalProducts} products
        </p> */}
      </div>
    </div>
  );
}
