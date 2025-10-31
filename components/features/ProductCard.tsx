import Image from "next/image";

interface ProductCardProps {
  id: number | string;
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
  price,
  inStock = true,
  className = "",
}: ProductCardProps) {
  return (
    <div
      key={id}
      className={`
         bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300 
         hover:-translate-y-1 hover:shadow-lg focus-within:shadow-lg focus-within:-translate-y-1
         overflow-hidden ${className}
        `}
      role="group"
      aria-label={`کارت محصول ${name}`}
    >
      {/* Product image */}
      <div className="relative w-full aspect-square bg-linear-to-b from-white to-[#f6f9fc]">
        <div className="absolute inset-0 -z-10" />
        <Image
          src={image}
          alt={name}
          fill
          className="w-full h-[140px] md:h-[180px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {!inStock && (
          <span className="absolute top-2 left-2 rounded-md bg-red-500 text-white text-xs px-2 py-1 shadow">
            ناموجود
          </span>
        )}
      </div>

      {/* Details and actions */}
      <div className="flex flex-col justify-between w-full p-4 gap-2">
        <h3 className="font-vazir-semibold text-sm md:text-base text-gray-800 text-center line-clamp-2">
          {name}
        </h3>

        <p className="text-primary font-vazir tracking-tight text-sm md:text-base text-center">
          {price.toLocaleString("fa-IR")} تومان
        </p>

        <div className="relative flex justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            className="
              bg-primary text-white text-xs md:text-sm font-vazir-semibold rounded-md 
              px-4 py-2 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2
            "
            aria-label={`مشاهده محصول ${name}`}
          >
            مشاهده
          </button>

          {inStock ? (
            <button
              className="
                border border-primary text-primary bg-primary/5
                text-xs md:text-sm font-vazir-semibold rounded-md 
                px-4 py-2 transition-all duration-300 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2
              "
              aria-label={`افزودن ${name} به سبد خرید`}
            >
              افزودن به سبد
            </button>
          ) : (
            <span
              className="text-xs text-red-500 font-vazir-medium"
              aria-live="polite"
            >
              ناموجود
            </span>
          )}

          {/* Glow ring on hover */}
          <span className="pointer-events-none absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[40px] rounded-full bg-cyan-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>
    </div>
  );
}
