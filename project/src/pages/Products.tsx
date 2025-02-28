import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { Product, ProductSize } from "../types";
import { useSearchParams } from "react-router-dom";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { Toast } from "../components/Toast";
import { AnimatedHeart } from "../components/AnimatedHeart";
import { PRODUCTS } from '../data/products';

// Add hover properties to all products
const updatedProducts = PRODUCTS.map(product => {
  const imagePath = product.image;
  const imageExtension = imagePath.split('.').pop(); // get file extension
  const imageBasePath = imagePath.substring(0, imagePath.lastIndexOf('.'));
  
  return {
    ...product,
    // Create hover image path by adding -benefits before the extension
    hoverImage: `${imageBasePath}-benefits.${imageExtension}`,
    // Add descriptive hover text based on category
    hoverDescription: getHoverDescription(product.category, product.name)
  };
});

// Helper function to generate meaningful hover descriptions
function getHoverDescription(category: string, name: string) {
  const descriptions: Record<string, string> = {
    'Spices': 'Rich in antioxidants and natural flavors. Perfect for authentic Indian cooking.',
    'Dairy': 'Fresh and pure dairy products rich in nutrients and healthy fats.',
    'Pulses': 'High in protein and fiber. Essential for a balanced diet.',
    'Oils': 'Cold-pressed and natural oils for healthy cooking.',
    'Salts': 'Natural minerals and pure taste enhancers.',
    'Natural Sweetness': 'Healthy alternatives to refined sugar.',
    'Honey': 'Pure and natural honey with medicinal properties.',
    'Rice': 'Premium quality grains for perfect cooking.',
    'Flours': 'Fresh-ground and nutrient-rich flour varieties.'
  };

  return descriptions[category] || `Learn more about ${name}`;
}

const CATEGORIES = [
  "All",
  "Spices",
  "Dairy",
  "Pulses",
  "Oils",
  "Salts",
  "Natural Sweetness",
  "Honey",
  "Rice",
  "Flours",
];

export const FEATURED_PRODUCTS = [
  // Your existing products array
];

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, toggleWishlist, wishlist, toast } = useStore();
  const [selectedSizes, setSelectedSizes] = useState<
    Record<string, ProductSize>
  >(Object.fromEntries(updatedProducts.map((p) => [p.id, p.sizes[0]])));
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", selectedCategory);
    }
    setSearchParams(searchParams);
  }, [selectedCategory, setSearchParams]);

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredProducts = updatedProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const handleSizeChange = (productId: string, size: ProductSize) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  return (
    <div className="relative">
      <Toast {...toast} />
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-96 px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-amber-500 text-white"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div 
                className="relative h-48 group cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${
                    hoveredProduct === product.id ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <img
                  src={product.hoverImage || product.image}
                  alt={`${product.name} detail`}
                  className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div 
                  className={`absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-t from-amber-50/90 to-transparent transition-opacity duration-300 ease-in-out ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className="text-amber-900 text-sm text-center font-medium">
                    {product.hoverDescription || product.description}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <div className="bg-white rounded-full p-1">
                    <AnimatedHeart 
                      isChecked={isInWishlist(product.id)}
                      onChange={() => toggleWishlist({
                        ...product,
                        selectedSize: selectedSizes[product.id],
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                  {product.name}
                </h3>
                <div className="relative mb-4">
                  <select
                    value={selectedSizes[product.id].size}
                    onChange={(e) => {
                      const size = product.sizes.find(
                        (s) => s.size === e.target.value
                      );
                      if (size) handleSizeChange(product.id, size);
                    }}
                    className="w-full appearance-none bg-amber-50 border border-amber-200 text-amber-900 py-2 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {product.sizes.map((size) => (
                      <option key={size.size} value={size.size}>
                        {size.size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-700 pointer-events-none" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-amber-900">
                    ₹{selectedSizes[product.id].price}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        addToCart({
                          ...product,
                          selectedSize: selectedSizes[product.id],
                        })
                      }
                      className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};