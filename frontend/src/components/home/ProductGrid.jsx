import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, onAdd }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {products.length > 0 ? (
        products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} onAdd={onAdd} />
        ))
      ) : (
        <div className="col-span-full text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-light tracking-wide mb-2">No products found</h3>
            <p className="text-stone-600 font-light">
              Check back later for new arrivals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
