import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { Product, ProductSize } from "../types";
import { useSearchParams } from "react-router-dom";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { Toast } from "../components/Toast";
import { AnimatedHeart } from "../components/AnimatedHeart";

// Update BASE_IMAGE_PATH to use absolute URL in production
const BASE_IMAGE_PATH = import.meta.env.PROD 
  ? 'https://paramprikswad.vercel.app/images/products'
  : '/images/products';

// Update image paths in PRODUCTS array
export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Turmeric Powder",
    description:
      "Premium quality organic turmeric powder with high curcumin content.",
    hoverDescription: "Rich in antioxidants and anti-inflammatory properties.",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/turmric.jpg`,
    hoverImage: `${BASE_IMAGE_PATH}/turmric.jpg`,
    type: "solid",
    sizes: [
      { size: "100g", price: 50 },
      { size: "200g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "2",
    name: "Pure Desi Ghee",
    description: "Traditional clarified butter made from pure cow milk.",
    category: "Dairy",
    image: `${BASE_IMAGE_PATH}/ghee.jpg`,
    hoverImage: `${BASE_IMAGE_PATH}/ghee-benefits.jpg`,
    hoverDescription: "Rich in vitamins A, D, E, and K. Perfect for cooking",
    type: "liquid",
    sizes: [
      { size: "200ml", price: 300 },
      { size: "500ml", price: 600 },
      { size: "1L", price: 1100 },
    ],
    inStock: true,
  },
  {
    id: "3",
    name: "Organic Red Chilli Powder",
    description: "Premium quality organic red chili Powder.",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/red-chilli.webp`,
    hoverImage: `${BASE_IMAGE_PATH}/red-chilli-benefits.jpg`,
    hoverDescription: "Adds perfect heat and color to your dishes",
    type: "solid",
    sizes: [
      { size: "100g", price: 50 },
      { size: "200g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "4",
    name: "Premium Basmati Rice",
    description: "Aged premium basmati rice with long grains.",
    category: "Rice",
    image: `${BASE_IMAGE_PATH}/rice-3506194_1920.jpg`,
    type: "solid",
    sizes: [
      { size: "500g", price: 115 },

      { size: "1kg", price: 230 },
    ],
    inStock: true,
  },
  {
    id: "5",
    name: "Garam Masala",
    description: "Authentic blend of ground spices used in Indian cuisine.",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/garammassala.jpg`,
    type: "solid",
    sizes: [
      { size: "50g", price: 50 },
      { size: "100g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "6",
    name: "Organic Pressed Coconut Oil",
    description: "Pure, natural & Organic cold-pressed coconut oil.",
    category: "Oils",
    image: `${BASE_IMAGE_PATH}/coconut-oil-6925841_1920.jpg`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 100 },
      { size: "200ml", price: 200 },
    ],
    inStock: true,
  },
  {
    id: "7",
    name: "Organic Black Mustard Oil",
    description: "Organic, Pure & natural cold-pressed Black Mustard Oil",
    category: "Oils",
    image: `${BASE_IMAGE_PATH}/organic-mustard-oil.jpeg`,
    type: "liquid",
    sizes: [
      { size: "500ml", price: 70 },
      { size: "1L", price: 150 },
    ],
    inStock: true,
  },
  {
    id: "8",
    name: "Organic Butter",
    description: "Pure, Organic & natural cold-pressed coconut oil.",
    category: "Dairy",
    image: `${BASE_IMAGE_PATH}/butter.jpg`,
    type: "liquid",
    sizes: [
      { size: "100g", price: 100 },
      { size: "200g", price: 200 },
      { size: "500g", price: 450 },
      { size: "1kg", price: 900 },
    ],
    inStock: true,
  },
  {
    id: "9",
    name: "Organic Lassi(Butter Milk)",
    description: "Pure and natural Lassi made with pure goodness.",
    category: "Dairy",
    image: `${BASE_IMAGE_PATH}/lassi.webp`,
    type: "liquid",
    sizes: [
      { size: "500ml", price: 20 },
      { size: "1L", price: 35 },
    ],
    inStock: true,
  },
  {
    id: "10",
    name: "Organic Yellow Mustard Oil",
    description: "Organic, Pure & natural cold-pressed Yellow Mustard Oil",
    category: "Oils",
    image: `${BASE_IMAGE_PATH}/yellow-mustard-oil.jpg`,
    type: "liquid",
    sizes: [
      { size: "500ml", price: 80 },
      { size: "1L", price: 150 },
    ],
    inStock: true,
  },
  {
    id: "11",
    name: "Organic Til Oil",
    description: "Organic Pure & natural cold-pressed Til Oil",
    category: "Oils",
    image: `${BASE_IMAGE_PATH}/til oil.jpg`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 250 },
      { size: "200ml", price: 450 },
      { size: "500ml", price: 750 },
      { size: "1L", price: 1550 },
    ],
    inStock: true,
  },
  {
    id: "12",
    name: "Organic Almond Oil",
    description: " Organic Pure & natural cold-pressed Almond Oil",
    category: "Oils",
    image: `${BASE_IMAGE_PATH}/almond oil.jpg`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 250 },
      { size: "200ml", price: 450 },
      { size: "500ml", price: 750 },
      { size: "1L", price: 1550 },
    ],
    inStock: true,
  },
  {
    id: "13",
    name: "Organic Pink salt/Sindha Salt",
    description: " Organic Pure & natural Pink salt/Sindha Salt Powder",
    category: "Salts",
    image: `${BASE_IMAGE_PATH}/Pink-Salt-powder.jpg`,
    type: "solid",
    sizes: [
      { size: "100g", price: 40 },
      { size: "200g", price: 80 },
    ],
    inStock: true,
  },
  {
    id: "14",
    name: "Organic Black Salt",
    description: " Organic Pure & natural Black Salt Powder",
    category: "Salts",
    image: `${BASE_IMAGE_PATH}/black salt.jpg`,
    type: "solid",
    sizes: [
      { size: "100g", price: 40 },
      { size: "200g", price: 80 },
    ],
    inStock: true,
  },
  {
    id: "15",
    name: "A2 Gir Cow Bilona Ghee",
    description: " Organic, Pure & natural A2 Gir Cow Bilona Ghee",
    category: "Dairy",
    image: `${BASE_IMAGE_PATH}/a2 cow ghee.jpg`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 250 },
      { size: "200ml", price: 450 },
      { size: "500ml", price: 750 },
      { size: "1L", price: 1550 },
    ],
    inStock: true,
  },
  {
    id: "16",
    name: "Organic Khand",
    description: " Organic, Pure & natural Khand",
    category: "Natural Sweetness",
    image: `${BASE_IMAGE_PATH}/khand.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "17",
    name: "Organic Khand",
    description: " Organic, Pure & natural Khand",
    category: "Natural Sweetness",
    image: `${BASE_IMAGE_PATH}/khand.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "18",
    name: "Desi Khand",
    description: " Pure & natural Desi Khand",
    category: "Natural Sweetness",
    image: `${BASE_IMAGE_PATH}/desi khand.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "19",
    name: "Organic Jaggery (GUD)",
    description: "Organic, Pure & natural Jaggery (GUD)",
    category: "Natural Sweetness",
    image: `${BASE_IMAGE_PATH}/organic gud.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "20",
    name: "Organic Jaggery Powder (Sakar)",
    description: "Organic, Pure & natural Jaggery powder (sakar)",
    category: "Natural Sweetness",
    image: `${BASE_IMAGE_PATH}/sakar.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "21",
    name: "Lichi Honey",
    description: "Pure & natural Lichi Honey",
    category: "Honey",
    image: `${BASE_IMAGE_PATH}/lichi honey.webp`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 80 },
      { size: "200ml", price: 150 },
      { size: "500ml", price: 400 },
      { size: "1L", price: 750 },
    ],
    inStock: true,
  },
  {
    id: "22",
    name: "Mustard Honey",
    description: "Pure & natural Mustard Honey",
    category: "Honey",
    image: `${BASE_IMAGE_PATH}/mustard honey.webp`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 80 },
      { size: "200ml", price: 150 },
      { size: "500ml", price: 400 },
      { size: "1L", price: 750 },
    ],
    inStock: true,
  },
  {
    id: "23",
    name: "Tulsi Honey",
    description: "Pure & natural Tulsi Honey",
    category: "Honey",
    image: `${BASE_IMAGE_PATH}/tulsi honey.png`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 80 },
      { size: "200ml", price: 150 },
      { size: "500ml", price: 400 },
      { size: "1L", price: 750 },
    ],
    inStock: true,
  },
  {
    id: "24",
    name: "Ajwain Honey",
    description: "Pure & natural Ajwain Honey",
    category: "Honey",
    image: `${BASE_IMAGE_PATH}/ajwain honey.webp`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 80 },
      { size: "200ml", price: 150 },
      { size: "500ml", price: 400 },
      { size: "1L", price: 750 },
    ],
    inStock: true,
  },
  {
    id: "25",
    name: "Multiflora Honey",
    description: "Pure & natural Multiflora Honey",
    category: "Honey",
    image: `${BASE_IMAGE_PATH}/multi flora.webp`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 80 },
      { size: "200ml", price: 150 },
      { size: "500ml", price: 400 },
      { size: "1L", price: 750 },
    ],
    inStock: true,
  },
  {
    id: "26",
    name: "Wild Honey",
    description: "Pure & natural Wild Honey",
    category: "Honey",
    image: `${BASE_IMAGE_PATH}/wild honey.png`,
    type: "liquid",
    sizes: [
      { size: "100ml", price: 80 },
      { size: "200ml", price: 150 },
      { size: "500ml", price: 400 },
      { size: "1L", price: 750 },
    ],
    inStock: true,
  },
  {
    id: "27",
    name: "Moong Whole",
    description: "Pure & natural Moong Whole",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/green moong daal.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "28",
    name: "Moong Chilka",
    description: "Pure & natural Moong Chilka",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/moong chilka.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "29",
    name: "Chana Whole",
    description: "Pure & natural Chana Whole",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/chana.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "30",
    name: "Chana Split",
    description: "Pure & natural Chana Split",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/ChanaDal.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "31",
    name: "Urad Daal Whole",
    description: "Pure & natural Urad Daal Whole",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/urad daal whole.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "32",
    name: "moong split washed",
    description: "Pure & Natural Moong Split Washed",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/moong daal.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "33",
    name: "Rajma",
    description: "Natural Rajma",
    category: "Pulses",
    image: `${BASE_IMAGE_PATH}/rajma.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "34",
    name: "Wheat Flour",
    description: "Natural Wheat flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/aata.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
      { size: "2kg", price: 310 },
    ],
    inStock: true,
  },
  {
    id: "35",
    name: "Organic Bansi Gold Wheat Flour",
    description: "Organic MP 306 Natural Wheat flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/organic aata.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
      { size: "2kg", price: 310 },
    ],
    inStock: true,
  },
  {
    id: "36",
    name: "Sprouted Wheat Flour",
    description: "Organic Sprouted Wheat Flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/Sprouted Wheat Flour.jpeg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "37",
    name: "Mutigrain Flour",
    description: "Organic Mutigrain Flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/multi grain aata.jpeg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
      { size: "2kg", price: 310 },
    ],
    inStock: true,
  },
  {
    id: "38",
    name: "Bajra Flour",
    description: "Organic Bajra Flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/bajara aata.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "39",
    name: "Makai Flour",
    description: "Organic Makai Flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/makai aata.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
      { size: "2kg", price: 310 },
    ],
    inStock: true,
  },
  {
    id: "40",
    name: "Chana Flour",
    description: "Organic Chana Flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/Chana Flour.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "41",
    name: "Jaw Flour",
    description: "Organic Jaw Flour",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/jaw aata.webp`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "42",
    name: "Besan",
    description: "Organic Besan",
    category: "Flours",
    image: `${BASE_IMAGE_PATH}/besan.jpg`,
    type: "solid",
    sizes: [
      { size: "200g", price: 40 },
      { size: "500g", price: 80 },
      { size: "1kg", price: 160 },
    ],
    inStock: true,
  },
  {
    id: "43",
    name: "Jeera",
    description: "Organic Jeera",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/jeera.png`,
    type: "solid",
    sizes: [
      { size: "50g", price: 50 },
      { size: "100g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "44",
    name: "Dhaniya Powder",
    description: "Organic Dhaniya Powder",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/dhaniya powder.webp`,
    type: "solid",
    sizes: [
      { size: "50g", price: 50 },
      { size: "100g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "45",
    name: "Lassi Masala Powder",
    description: "Organic Lassi Masla Powder",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/lassi massala.jpg`,
    type: "solid",
    sizes: [
      { size: "50g", price: 50 },
      { size: "100g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "46",
    name: "Chaat Masala Powder",
    description: "Organic Lassi Masla Powder",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/chaat masala.jpg`,
    type: "solid",
    sizes: [
      { size: "50g", price: 50 },
      { size: "100g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "47",
    name: "Sabji Masala Powder",
    description: "Organic Sabji Masla Powder",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/sabji masala.jpg`,
    type: "solid",
    sizes: [
      { size: "50g", price: 50 },
      { size: "100g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "48",
    name: "Degi Mirchi Powder",
    description: "Organic Degi Mirchi Powder",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/degi mirch.webp`,
    type: "solid",
    sizes: [
      { size: "100g", price: 50 },
      { size: "200g", price: 100 },
    ],
    inStock: true,
  },
  {
    id: "49",
    name: "Kasturi Methi",
    description: "Organic Kasturi Methi",
    category: "Spices",
    image: `${BASE_IMAGE_PATH}/kasturi methi.jpg`,
    type: "solid",
    sizes: [
      { size: "100g", price: 80 },
      { size: "200g", price: 150 },
    ],
    inStock: true,
  },
];

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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

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

  useEffect(() => {
    // Preload images
    Promise.all(
      PRODUCTS.map(product => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = product.image;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
        });
      })
    ).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  // Add loading state
  if (!imagesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

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

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
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
                  src={imageErrors[product.id] ? '/images/placeholder.jpg' : product.image}
                  alt={product.name}
                  onError={() => handleImageError(product.id)}
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