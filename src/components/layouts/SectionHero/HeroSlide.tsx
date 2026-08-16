import Image from "next/image";
import Link from "next/link";
import type { Slide } from "./hero.data";

type Props = {
  slide: Slide;
  isPrimary?: boolean;
  isActive?: boolean;
};

export default function HeroSlide({
  slide,
  isPrimary = false,
  isActive = true,
}: Props) {
  return (
    <>
      <div className="absolute inset-0">
        {isActive || isPrimary ? (
          <Image
            src={slide.image}
            alt=""
            fill
            priority={isPrimary}
            quality={isPrimary ? 75 : 65}
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex h-full items-end pb-20 sm:pb-24 lg:items-center lg:pb-0">
        <div
          className={`container mx-auto w-full max-w-7xl px-5 sm:px-8 ${
            slide.align === "left" ? "lg:pr-[8%]" : "lg:pl-[8%]"
          }`}
        >
          <div
            className={`max-w-xl ${
              slide.align === "left" ? "lg:mr-auto" : "lg:ml-auto lg:text-right"
            }`}
          >
            <p className="mb-3 text-[11px] font-bold tracking-[0.22em] text-white/70 sm:text-xs">
              SIEMENS PLUS
            </p>

            {isPrimary ? (
              <h1 className="text-[1.75rem] font-black leading-[1.25] text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                {slide.title}
              </h1>
            ) : (
              <h2 className="text-[1.75rem] font-black leading-[1.25] text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                {slide.title}
              </h2>
            )}

            <p className="mt-3 max-w-md text-sm leading-7 text-white/85 sm:mt-4 sm:text-base lg:text-lg">
              {slide.highlight}
            </p>

            <div className="mt-7 sm:mt-9">
              <Link
                href={slide.href}
                className="inline-flex min-h-[48px] items-center justify-center border border-white bg-white px-7 text-sm font-bold text-slate-900 transition hover:bg-transparent hover:text-white sm:px-9 sm:text-base"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
