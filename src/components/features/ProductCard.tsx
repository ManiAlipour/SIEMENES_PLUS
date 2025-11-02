import Image from "next/image";
import LikeProduct from "./LikeProduct";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  inStock?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  // price,
  inStock = true,
  className = "",
}: ProductCardProps) {
  return (
    <div
      key={id}
      className={`
        flex flex-col h-full
        bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:shadow-lg focus-within:-translate-y-1
        ${className}
      `}
      role="group"
      aria-label={`کارت محصول ${name}`}
    >
      {/* Product image */}
      <div className="relative w-full aspect-square bg-linear-to-b from-white to-[#f6f9fc] flex items-center justify-center">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {!inStock && (
          <span className="absolute top-2 left-2 rounded-md bg-red-500 text-white text-xs px-2 py-1 shadow">
            ناموجود
          </span>
        )}
      </div>

      {/* Details & Actions */}
      <div className="flex flex-col grow justify-between w-full p-4 gap-2">
        <div>
          <h3 className="font-vazir-semibold text-sm md:text-base text-gray-800 text-center line-clamp-2 min-h-10">
            {name}
          </h3>
          {/* <p className="text-primary font-vazir tracking-tight text-sm md:text-base text-center mt-1">
            {price.toLocaleString("fa-IR")} تومان
          </p> */}
        </div>

        <div className="relative flex justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            className="
              bg-primary text-white text-xs md:text-sm font-vazir-semibold rounded-md 
              px-4 py-2 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2
            "
          >
            مشاهده
          </button>

          <LikeProduct id={id} />

          {/* Glow ring */}
          <span className="pointer-events-none absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-10 rounded-full bg-cyan-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>
    </div>
  );
}
