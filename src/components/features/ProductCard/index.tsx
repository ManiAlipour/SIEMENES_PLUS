"use client";

import { memo } from "react";
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
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/slices/likedPosts";

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

function ProductCard({
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

  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Add to cart", id);
    dispatch(addProduct(id));
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Quick view", id);
  };

  return (
    <ProductCardContainer name={name} className={className}>
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

export default memo(ProductCard);
