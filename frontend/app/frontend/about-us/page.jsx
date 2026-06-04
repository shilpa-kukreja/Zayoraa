"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800 antialiased">
      <Navbar />
      <section>
        <div>
          <img
            src="/about-us/banner.png"
            alt="About Banner"
            className="w-full object-cover "

          />
        </div>
      </section>

      {/* Luxury About Section */}
      <section className="max-w-7xl mx-auto px-8 py-10 relative">
        {/* <div className="absolute -top-10 left-1/2 w-0.5 h-20 bg-[#7a1113]"></div> */}
        <div className="flex flex-col lg:flex-row gap-16 items-stretch">
          {/* Left Image with Luxury Treatment */}
          <div className="lg:w-1/2 w-full relative group">
            <div className="absolute -inset-2 bg-gradient-to-r  rounded-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 -rotate-1"></div>
            <div className="relative h-full rounded-xl overflow-hidden">
              <Image
                src="/banner/about.png"
                alt="About Us Image"
                width={800}
                height={800}
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-8">
                <span className="text-white font-medium tracking-wider">
                  {/* Our state-of-the-art facility in California */}
                </span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 w-full flex flex-col justify-center">
            {/* <span className="text-xs uppercase text-[#4c29b3] tracking-widest mb-4">
              About Us
            </span> */}
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight">
              <span className="font-semibold text-[#6441ce] ">Crafting</span>{" "}
              bags that blend <br />
              <span className="font-medium">style with purpose</span>
            </h2>
            <div className="prose prose-lg text-gray-600 mb-10">
              <p>
                At Syuta, we craft more than just bags—we create companions for
                modern women who balance multiple roles with grace. Every piece
                reflects a fusion of elegance, utility, and trend, making it a
                perfect fit for both daily life and special occasions.
              </p>
              <p>
                Our designs are carefully thought out, keeping practicality and
                aesthetics at the forefront. With quality craftsmanship and
                premium materials, each bag carries a story of confidence and
                individuality. At Syuta, we aim to make every woman feel
                empowered, stylish, and prepared for any moment.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/frontend/view-all"
                className="relative overflow-hidden group px-8 py-4 bg-[#6747c7] hover:bg-black text-white rounded-lg transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Discover Our Collection
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                <span className="absolute inset-0 bg-[#4c29b3]  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                href="/frontend/about-us"
                className="px-8 py-4 border border-gray-300 hover:border-[#4c29b3]  text-gray-700 hover:text-[#4c29b3]  rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Our Craftsmanship
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Diagonal Divider */}
      <div className="relative bg-gray-50">
        <section className="max-w-7xl mx-auto px-8 py-8 relative z-10">
          <div className="text-center mb-8">
            <span className="text-xs uppercase text-[#4c29b3]  tracking-widest mb-4 inline-block">
              Our Philosophy
            </span>
            <h2 className="text-4xl font-medium">
              <span className="font-semibold text-[#4c29b3]">Guiding</span>{" "}
              Principles
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="bg-white p-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex sm:flex-row flex-col items-start mb-8">
                <div className="border border-violet-400 shadow-xl p-4 rounded-lg mr-6">
                  <svg
                    className="sm:w-8 sm:h-8 w-6 h-6 text-[#4c29b3] "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="">
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To design bags that empower women by blending timeless
                    aesthetics with practical features. We want to make everyday
                    living effortless and elegant, ensuring each design supports
                    women in every step of their journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white p-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-start sm:flex-row flex-col mb-8">
                <div className="border border-violet-400 shadow-xl p-4 rounded-lg mr-6">
                  <svg
                    className="sm:w-8 sm:h-8 w-6 h-6 text-[#4c29b3] "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To be recognized as a global brand known for its versatile
                    and high-quality creations. We envision a world where every
                    woman can express her individuality through a bag that
                    adapts seamlessly to her lifestyle, whether at work, travel,
                    or leisure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Core Values with Floating Animation */}
      <section className="max-w-7xl mx-auto px-8 py-8">
        <div className="text-center mb-20">
          <span className="text-xs uppercase text-[#4c29b3] tracking-widest mb-4 inline-block">
            {/* The Health Story Standard */}
          </span>
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            <span className="font-semibold text-[#4c29b3]">Our Design &</span>{" "}
            Crafting Process
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Design Belief",
              description:
                "We believe great design is born from understanding women’s dynamic lifestyles. Every Syuta bag starts as a thoughtful sketch that merges fashion with everyday functionality.",
              icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
            },
            {
              title: "Material Belief",
              description:
                "We believe in quality that lasts. That’s why we carefully source durable fabrics, fine textures, and premium hardware to ensure every bag is stylish yet resilient.",
              icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
            },
            {
              title: "Craftsmanship Belief",
              description:
                " We believe true beauty lies in details. From precise stitching to finishing touches, our skilled artisans pour care and expertise into every step of creation.",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-violet-100 group"
            >
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mb-8 group-hover:bg-violet-100 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-[#4c29b3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d={value.icon}
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder's Note */}
      {/* <section className="bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 w-full">
              <div className="relative aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="/banner/about-us3.webp"
                  alt="Founder"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  quality={100}
                />
              </div>
            </div>
            <div className="md:w-2/3 w-full">
              <span className="text-xs uppercase text-green-600 tracking-widest mb-4 inline-block">
                A Personal Note
              </span>
              <h3 className="text-3xl font-light text-gray-900 mb-6 leading-tight">
                <span className="font-serif italic">From</span> Our Founder
              </h3>
              <blockquote className="text-gray-600 italic text-lg leading-relaxed mb-8">
                "True wellness begins when we honor both the science of nutrition and the wisdom of nature. 
                At Health Story, we've created more than products—we've created a new paradigm for living well."
              </blockquote>
              <div className="text-gray-700">
                <p className="font-medium">Dr. Sarah Williamson</p>
                <p className="text-sm">Founder & Chief Formulator</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
