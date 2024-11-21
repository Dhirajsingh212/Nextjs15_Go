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
import { useCallback, useEffect, useState } from "react";

// Type definitions
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface ProductListProps {
  initialData: Product[];
  totalPages: number;
  totalProducts: number;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function ProductList({
  initialData,
  totalPages,
  totalProducts,
  isLoading = false,
}: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");

  // Get current page from URL
  const page = Number(searchParams.get("page") || "1");

  // Debounced search handler
  const updateSearchQuery = useCallback((value: string) => {
    setSearchText(value);
    const timer = setTimeout(() => {
      updateQueryParams({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Update URL parameters
  const updateQueryParams = useCallback(
    (params: Record<string, string | number>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/home${query}`);
    },
    [router, searchParams]
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategory(value);
      updateQueryParams({
        category: value === "All" ? "" : value.toLowerCase(),
        page: 1,
      });
    },
    [updateQueryParams]
  );

  // Calculate pagination details
  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, totalProducts);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <Button>Signout</Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex-1 flex items-center w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search products..."
            className="mr-2"
            value={searchText}
            onChange={(e) => updateSearchQuery(e.target.value)}
          />
          <Button variant="outline" className="whitespace-nowrap">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex items-center w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Home">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {initialData && initialData.length > 0 ? (
            initialData.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <Image
                    src={
                      product.imageUrl ||
                      "https://i.pinimg.com/originals/65/20/8a/65208a3bf337a541f70419e31474c885.gif"
                    }
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="mb-2 text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
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
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              No products found
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
                    updateQueryParams({
                      page: Math.min(totalPages, page + 1),
                    })
                  }
                  className={
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-sm text-gray-600 mt-2">
            Showing {startItem} - {endItem} of {totalProducts} products
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
