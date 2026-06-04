"use client"; // if using in app router

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  const slides = [
    {
      desktop: "/hero/banner1.png",
      mobile: "/mobilebanner1.webp",
    },
    {
      desktop: "/hero/banner2.png",
      mobile: "/mobilebanner2.webp",
    },
    
  ];

  return (
    <div className="w-full overflow-hidden">
      <Slider {...settings} className="w-full">
        {slides.map((slide, index) => (
          <div key={index}>
            <img
              src={slide.desktop}
              alt={`Desktop Banner ${index + 1}`}
              className="w-full object-cover !hidden sm:!block"
            />
            <img
              src={slide.mobile}
              alt={`Mobile Banner ${index + 1}`}
              className="w-full object-cover !block sm:!hidden"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;
