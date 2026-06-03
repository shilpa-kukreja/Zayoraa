"use client";
import React, { useContext } from 'react'
import Navbar from './frontend/components/Navbar'
import HomeSlider from './frontend/components/HomeSlider'
import NewArrivals from './frontend/components/ProductSlider'
import FeaturedProducts from './frontend/components/FeaturedProducts'
import {  products, videos } from '@/public/assets'
import CategoryShowcase from './frontend/components/CategoryShowcase'
import VideoShowcase from './frontend/components/VideoShowcase'
import MediaSlider from './frontend/components/MediaSlider'
import CompareSlider from './frontend/components/CompareSlide'
import Footer from './frontend/components/Footer'
import BlogSection from './frontend/components/BlogSection'
import { AppContext } from './frontend/context/AppContext';
import AnnouncementBar from './frontend/components/AnnouncementBar';
import ImageBanner from "./frontend/components/ImageBanner"
import NewArrival from './frontend/components/NewArrival';
import BestSeller from './frontend/components/BestSeller';
import Deals from "./frontend/components/Deals";




const Home = () => {
  const {products, videos  } = useContext(AppContext);
   
  return (
    <>
    <AnnouncementBar/>
      <Navbar />
      {/* Padding to prevent slider hiding under the fixed navbar */}
      <div >
        <HomeSlider />
      </div>
      <NewArrival/>
       <Deals/>
     
      <BestSeller/>
      {/* <FeaturedProducts/> */}
       <ImageBanner/>
      <CategoryShowcase />
      <VideoShowcase />
      {/* <MediaSlider/> */}
      <BlogSection/>
      {/* <CompareSlider/> */}
     
     <Footer/>
    </>
  )
}

export default Home
