// pages/blog/index.js (Blog listing page)
"use client"
import React, { useContext } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { getBackendImageUrl } from '@/lib/getBackendImageUrl';

const BlogPage = () => {

 const {blogs}=useContext(AppContext)

   const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  return (
    <>
      <Head>
        <title>Blog | Suyta Lifestyle</title>
        <meta name="description" content="Discover the latest trends, styling tips, and inspiration from our experts" />
      </Head>
      <Navbar/>
      <div>
                <img src="/blogs/banner.png" alt="" />
            </div>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="container mx-auto ">
            
          <div className="text-center pt-4 mb-12">
            <h1 className="text-2xl md:text-4xl  font-bold text-gray-900">Our Blogs</h1>
             <div className="flex items-center justify-center gap-3">
     <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-35 h-[3px] bg-gray-300"></span>
    <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-35 h-[3px] bg-gray-300"></span>
     <span className="text-[#6b40c2] text-xl">✦</span>
  </div>
            {/* <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest trends, styling tips, and inspiration from our experts
            </p> */}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-8 gap-2 sm:px-10 px-2">
            {blogs.map((blog) => (
              <article key={blog._id} className="bg-white rounded-md overflow-hidden  border border-[#6447bb] shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={getBackendImageUrl(blog.blogImg)}
                    alt={blog.blogName}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-[#5f44af] sm:px-3 px-2 py-1 rounded-md shadow-sm">
                    <span className="text-xs font-medium text-white">{blog.blogDate}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl  font-bold text-gray-900 mb-3 line-clamp-2 capitalize hover:text-[#5f45ac] transition-colors">
                    {blog.blogName}
                  </h2>
                  <p className="text-gray-600 mb-4 hidden sm:block  line-clamp-3">
                    {stripHtml(blog.blogDetail.substring(0, 110))}...
                  </p>

                   <p className="text-gray-600 mb-4 block sm:hidden  line-clamp-3">
                    {stripHtml(blog.blogDetail.substring(0, 50))}...
                  </p>
                  <Link 
                    href={`/frontend/blog/${blog.blogSlug}`}
                      className="inline-flex items-center text-black font-medium hover:text-[#7256c9] transition-colors group"
                  >
                    Read More
                    <svg 
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};


 

export default BlogPage;