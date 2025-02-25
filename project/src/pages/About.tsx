import React, { useState, useEffect } from "react";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { CheckCircle2, Users, Truck, LeafyGreen } from "lucide-react";

const PRODUCT_IMAGES = [
  "/images/mustard honey.webp",
  "/images/ghee.jpg",
  "/images/turmric.jpg",
  "/images/organic aata.jpg",
  "/images/Pink-Salt-powder.jpg",
  "/images/garammassala.jpg",
  "/images/almond oil.jpg",
  "/images/desi khand.webp",
  "/images/chana.webp",
  "/images/masoor daal.webp",
  "/images/multi flora.webp",
  "/images/moong chilka.webp",
  "/images/lassi.webp",
  "/images/butter.jpg",
];

export const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % PRODUCT_IMAGES.length);
    }, 4000); //Duration

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div
        className="relative min-h-[400px] md:h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/mustard honey.webp')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 to-amber-950/60" />
        <div className="relative z-10 h-full flex items-center py-12 md:py-0">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
            <p className="text-lg md:text-xl text-amber-100 max-w-2xl">
              Bringing authentic Indian flavors to your kitchen since 2023.
              We're passionate about quality, tradition, and the rich heritage
              of Indian spices.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-12 md:py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-6">
                Our Mission
              </h2>
              <p className="text-amber-800 mb-6">
                At Paramprik Swad, we're committed to delivering the finest
                quality Indian spices and groceries while preserving traditional
                flavors and supporting sustainable farming practices.
              </p>
              <div className="space-y-4">
                {[
                  "Premium quality products",
                  "Authentic Indian flavors",
                  "Sustainable sourcing",
                  "Traditional methods",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="text-amber-600 h-5 w-5" />
                    <span className="text-amber-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 md:order-2 mb-8 md:mb-0">
              <div
                className="relative rounded-lg shadow-xl overflow-hidden"
                style={{ height: "300px", maxHeight: "50vh" }}
              >
                {PRODUCT_IMAGES.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${
                      index === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                    style={{
                      transitionProperty: "opacity, transform",
                      transitionDuration: "1.5s",
                      transitionTimingFunction: "ease-in-out",
                    }}
                  />
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-amber-500 text-white p-3 md:p-4 rounded-lg shadow-lg z-10">
                <p className="font-bold text-xl md:text-2xl">100+</p>
                <p className="text-xs md:text-sm">Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 text-center mb-8 md:mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: LeafyGreen,
                title: "Organic Products",
                description:
                  "All our products are organic and naturally sourced",
              },
              {
                icon: Users,
                title: "Customer First",
                description:
                  "Dedicated to providing the best customer experience",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Quick and reliable delivery to your doorstep",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-amber-50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-amber-800">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Promise */}
      <div className="py-12 md:py-20 bg-gradient-to-b from-amber-100 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4 md:mb-6">
            Our Quality Promise
          </h2>
          <p className="text-amber-800 max-w-2xl mx-auto mb-8 md:mb-12 px-4">
            We carefully select and test each product to ensure it meets our
            high standards of quality. Our commitment to excellence is reflected
            in every product we offer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { number: "100%", text: "Natural" },
              { number: "0", text: "Artificial Colors" },
              { number: "100%", text: "Pure" },
              { number: "100%", text: "Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <p className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm md:text-base text-amber-800">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
};
