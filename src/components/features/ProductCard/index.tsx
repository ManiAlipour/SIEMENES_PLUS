"use client";

import { useRouter } from "next/navigation";
import ProductCardContainer from "./CardContainer";
import ProductBadge from "./FeaturedBadge";
import ProductImage from "./CardImage";
import ProductInfo from "./CardInfo";
import {
  MobileActions,
  DesktopTopActions,
  DesktopFloatingActions,
} from "./CardActions";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price?: number;
  inStock?: boolean;
  brand?: string;
  isFeatured?: boolean;
  slug?: string;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  inStock = true,
  brand,
  isFeatured = false,
  slug,
  className = "",
}: ProductCardProps) {
  const router = useRouter();
  const productUrl = slug ? `/shop/${slug}` : `/shop/${id}`;

  const handleNavigate = () => router.push(productUrl);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Add to cart", id);
    // Add your logic here
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Quick view", id);
    // Add your logic here
  };

  // JSON-LD Schema
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    image,
    brand: { "@type": "Brand", name: brand || "Siemens" },
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <ProductCardContainer name={name} className={className}>
      {/* JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

      <ProductBadge isFeatured={isFeatured} />

      {/* Action Buttons Layer */}
      <MobileActions id={id} />
      <DesktopTopActions id={id} brand={brand} />

      {/* Image Layer (contains Floating Desktop Actions) */}
      <div className="relative">
        <DesktopFloatingActions
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
        />
        <ProductImage src={image} alt={name} onClick={handleNavigate} />
      </div>

      {/* Content Layer */}
      <ProductInfo
        name={name}
        price={price}
        inStock={inStock}
        brand={brand}
        onNavigate={handleNavigate}
      />
    </ProductCardContainer>
  );
}
