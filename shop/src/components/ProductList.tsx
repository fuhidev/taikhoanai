"use client";

import { Product } from "@/types";
import React from "react";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
 products: Product[];
 title?: string;
 showFeaturedOnly?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
 const filteredProducts = products;

 return (
  <section className="">
   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {filteredProducts.length === 0 ? (
     <div className="text-center py-12">
      <p className="text-muted-foreground text-lg">
       Hiện tại chưa có sản phẩm nào.
      </p>
     </div>
    ) : (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
       <ProductCard key={product.id} product={product} />
      ))}
     </div>
    )}
   </div>
  </section>
 );
};
