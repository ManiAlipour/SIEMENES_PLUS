import Image from "next/image";
import Link from "next/link";
import type { Slide } from "./hero.data";

type Props = {
  slide: Slide;
  isPrimary?: boolean;
  isActive?: boolean;
};

export default function HeroSlide({ slide, isPrimary = false }: Props) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority={isPrimary}
          quality={isPrimary ? 80 : 70}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 md:bg-black/20" />
      </div>

      <div
        className={`relative z-10 h-full container mx-auto px-6 flex items-center justify-center ${
          slide.align === "left" ? "lg:justify-start" : "lg:justify-end"
        }`}
      >
        <div
          className={`max-w-3xl w-full flex flex-col items-center animate-fadeIn ${
            slide.align === "left"
              ? "lg:items-start lg:text-right"
              : "lg:items-start lg:pr-20 lg:text-right"
          }`}
        >
          {isPrimary ? (
            <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-5xl leading-tight">
              {slide.title}
            </h1>
          ) : (
            <h2 className="text-white font-black text-2xl sm:text-3xl lg:text-5xl leading-tight">
              {slide.title}
            </h2>
          )}

          <p className="mt-1 lg:mt-4 text-white/90 font-medium text-sm sm:text-lg lg:text-2xl">
            {slide.highlight}
          </p>

          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed hidden lg:block text-right">
            {slide.description}
          </p>

          <div className="mt-6 lg:mt-10">
            <Link
              href={slide.href}
              className="inline-flex items-center justify-center px-6 py-2 lg:px-10 lg:py-3.5 border-2 border-white text-white font-bold text-xs sm:text-sm lg:text-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
