import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animateCategories = (categoriesRef: React.RefObject<HTMLDivElement>) => {
  const categories = categoriesRef.current?.children;
  if (categories) {
    // Set initial state
    gsap.set(categories, { opacity: 0, y: 50 });
    
    // Create animation
    gsap.to(categories, {
      scrollTrigger: {
        trigger: categoriesRef.current,
        start: "top bottom-=100",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      immediate: true
    });
  }
};

export const animateProducts = (productsRef: React.RefObject<HTMLDivElement>) => {
  const products = productsRef.current?.children;
  if (products) {
    // Set initial state
    gsap.set(products, { opacity: 0, y: 50 });
    
    // Create animation
    gsap.to(products, {
      scrollTrigger: {
        trigger: productsRef.current,
        start: "top bottom-=100",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: {
        amount: 0.8,
        grid: "auto"
      },
      ease: "power2.out",
      immediate: true
    });
  }
};

export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
