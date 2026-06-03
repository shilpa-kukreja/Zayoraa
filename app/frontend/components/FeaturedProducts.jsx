import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const featuredProducts = [
  {
    id: '7',
    name: 'Product7',
    image: '/product/Group1.png',
    label: 'SOLEIL CROSSBODY BAG',
    link: '/products/product-7',
    description: 'Elegant crossbody bag with premium leather finish'
  },
  {
    id: '8',
    name: 'Product8',
    image: '/product/Group2.png',
    label: 'MARTINA TOTE BAG',
    link: '/products/product-8',
    description: 'Spacious tote with durable construction and modern design'
  },
];

const FeaturedProducts = () => {
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-12 py-6">
      <h2 className="sm:text-4xl text-2xl font-semibold text-center sm:mb-12 mb-6 uppercase text-black">Featured Collections</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Image with overlay effect */}
            <div className="relative w-full h-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Product info overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10">
              <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                  {product.label}
                </h3>
                <p className="text-gray-200 mb-6 max-w-md drop-shadow-md">
                  {product.description}
                </p>
                <Link
                  href={product.link}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-[#bf191c] hover:bg-[#7a1113] transition-colors duration-300"
                >
                  Shop Now
                  <svg
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;