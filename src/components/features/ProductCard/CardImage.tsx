import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export default function ProductImage({ src, alt, onClick }: ProductImageProps) {
  return (
    <div
      onClick={onClick}
      className="
          relative aspect-[4/3] sm:aspect-square cursor-pointer
          bg-gradient-to-br from-gray-50 via-white to-gray-100
          overflow-hidden transition-all duration-500
          group-hover:shadow-inner
        "
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes="(max-width:640px)100vw, (max-width:1024px)50vw, 25vw"
        className="object-contain p-4 sm:p-6 md:p-10 transition-transform duration-300 group-hover:scale-[1.02] group-hover:drop-shadow-lg"
      />

      {/* Subtle hover glow - CSS only */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-blue-200/15 to-transparent" />
      </div>
    </div>
  );
}
