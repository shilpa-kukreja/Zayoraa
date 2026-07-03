"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden">
        <img
          src="/imagebanner/1.jpeg" // Place your image in public/banner/banner.jpg
          alt="Banner"
          fill
          priority
          className="object-cover"
        />

      
        {/* Optional Content */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Your Banner Heading
            </h2>
            <p className="text-lg md:text-xl">
              Add your banner description here
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}