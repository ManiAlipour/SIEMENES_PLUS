import Link from "next/link";
import Image from "next/image";
import AparatPlayer from "./AparatPlayer";
import { BlogPost } from "@/data/blog-data";

export default function BlogCard({ post }: { post: BlogPost }) {
  const { title, description, image, videoUrl, slug } = post;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-[#f7f9fb] shadow-sm hover:border-primary/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus-within:shadow-lg"
      aria-label={`مطلب: ${title}`}
    >
      {/* Media (video or image) */}
      <div className="relative w-full aspect-video overflow-hidden">
        {videoUrl ? (
          <div className="absolute inset-0">
            <AparatPlayer videoUrl={videoUrl} />
          </div>
        ) : (
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width:768px) 100vw, 600px"
            priority={false}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <h3 className="text-lg md:text-xl font-vazir-bold text-gray-800 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

        <Link
          href={`/blog/${slug}`}
          className="mt-auto self-start px-4 py-2 border border-primary text-primary rounded-md font-vazir-medium hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
          aria-label={`مطالعه بیشتر: ${title}`}
        >
          مطالعه بیشتر
        </Link>
      </div>
    </article>
  );
}
