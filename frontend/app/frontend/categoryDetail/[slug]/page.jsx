'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { products, categories } from '@/public/assets';

const CategoryPage = () => {
  const params = useParams();
  const { slug } = params;
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    // Find the current category
    const currentCategory = categories.find(cat => cat.slug === slug);
    setCategory(currentCategory);

    // Filter products that belong to this category
    if (currentCategory) {
      const filteredProducts = products.filter(product => 
        product.category.includes(currentCategory.id.toString())
      );
      setCategoryProducts(filteredProducts);
    }
  }, [slug]);

  if (!category) {
    return <div className="container mx-auto py-12 text-center">Category not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Hero */}
      <div className="relative h-64 bg-gray-200">
        <Image
          src={category.img}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="sm:text-4xl text-2xl font-bold text-white">{category.name}</h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryProducts.map(product => {
            const minPrice = Math.min(...product.variant.map(v => v.discountPrice || v.price));
            const maxPrice = Math.max(...product.variant.map(v => v.discountPrice || v.price));
            const hasDiscount = product.variant.some(v => v.discountPrice);

            return (
              <div key={product.id} className="group relative">
                <Link href={`/products/${product.slug}`} className="block h-full">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-200">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.thumbImg}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <div className="mt-auto">
                        <div className="flex items-center">
                          {minPrice !== maxPrice ? (
                            <span className="text-gray-900 font-medium">
                              ₹{minPrice} - ₹{maxPrice}
                            </span>
                          ) : (
                            <span className="text-gray-900 font-medium">₹{minPrice}</span>
                          )}
                          {hasDiscount && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{product.variant.find(v => v.discountPrice)?.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;