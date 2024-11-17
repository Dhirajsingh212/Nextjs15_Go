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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import Image from "next/image";

// Client Component for interactivity
export function ProductList({ initialData }: any) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <form className="flex-1 flex items-center">
          <Input
            type="search"
            placeholder="Search products..."
            className="mr-2"
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
    </div>
  );
}
