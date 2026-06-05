// components/BlogSection.js (for homepage)
"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { getBackendImageUrl } from '@/lib/getBackendImageUrl';

import { AppContext } from '../context/AppContext';

const BlogSection = () => {

   const {blogs} =  useContext(AppContext);
   const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  return (
    <section className="sm:py-10  py-6 bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-[1650px] mx-auto sm:px-4 px-2">
        <div className="text-center sm:mb-10 mb-5">
          {/* <span className="text-[#6b40c2] font-semibold text-sm uppercase tracking-wider mb-2 block">
            Insights & Inspiration
          </span> */}
          <h2 className="sm:text-4xl text-2xl font-semibold text-center uppercase text-black">
            Latest From Our Blog
          </h2>
           <div className="flex items-center justify-center gap-3">
     <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-35 h-[3px] bg-gray-300"></span>
    <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-35 h-[3px] bg-gray-300"></span>
     <span className="text-[#6b40c2] text-xl">✦</span>
  </div>
          {/* <div className="w-20 h-1 bg-[#7a1113] mx-auto mb-6"></div> */}
          {/* <p className="text-gray-600 max-w-2xl mx-auto sm:text-lg text-sm">
            Uncover fashion trends, styling advice, and inspiration curated by Syuta experts
          </p> */}
        </div>
        
        <div className="grid   grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-8 gap-2">
         {blogs.slice(0, 4).map((blog) => (
  <article 
    key={blog._id} 
    className="bg-white border border-[#6b40c2] rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <div className="relative h-60 overflow-hidden">
      <img
        src={getBackendImageUrl(blog.blogImg)}
        alt={blog.blogName}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute top-4 left-4 bg-[#6b40c2] px-3 py-0.5  rounded-md shadow-sm">
        <span className="text-xs font-medium text-white ">{blog.blogDate}</span>
      </div>
    </div>
    
    <div className="py-3 px-4">
      <div className="flex items-center mb-3 text-xs text-gray-500">
        <span className="mr-3">By {blog.author || "Admin"}</span>
        {/* <span>•</span> */}
        {/* <span className="ml-3">{blog.readTime || "5 min read"}</span> */}
      </div>
      
      <h3 className="sm:text-xl text-lg capitalize font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5c29c2] transition-colors duration-300">
        {blog.blogName}
      </h3>
      
      <p className="text-gray-600 hidden sm:block mb-2 line-clamp-3 text-sm leading-relaxed">
        {stripHtml(blog.blogDetail).substring(0, 70)}...
      </p>

       <p className="text-gray-600 sm:hidden block mb-2 line-clamp-3 text-sm leading-relaxed">
        {stripHtml(blog.blogDetail).substring(0, 50)}...
      </p>
      
      <Link href={`/frontend/blog/${blog.blogSlug}`} className="inline-flex items-center text-black font-medium hover:text-[#6b40c2] transition-colors group/link">
        Read More
        <svg className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </article>
))}

        </div>
        
        <div className="text-center sm:mt-10 mt-5">
          <Link 
            href="/frontend/blogs"
            className="inline-flex items-center justify-center px-6 py-2 bg-[#6b40c2] border border-gray-200 rounded-xl text-white font-semibold hover:bg-black hover:border-black transition-all duration-300 hover:shadow-md group/button"
          >
            View All Articles
            <svg 
              className="w-5 h-5 ml-2 transition-transform group-hover/button:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;