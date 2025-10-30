import Link from "next/link";
import Image from "next/image";
import AparatPlayer from "./AparatPlayer";
import { BlogPost } from "@/assets/data/blog-data";

export default function BlogCard({ post }: { post: BlogPost }) {
  const { title, description, image, videoUrl, slug } = post;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200
                 bg-[#f7f9fb] hover:border-primary hover:shadow-lg hover:-translate-y-1
                 transition-all duration-300"
    >
      {/* مدیا (ویدیو یا تصویر) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
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
      </div>

      {/* محتوا */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <h3
          className="text-lg md:text-xl font-vazir-bold text-gray-800 
                     group-hover:text-primary transition-colors"
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

        <Link
          href={`/blog/${slug}`}
          className="mt-auto self-start px-4 py-2 border border-primary text-primary rounded-md 
                     font-vazir-medium hover:bg-primary hover:text-white transition-colors"
        >
          مطالعه بیشتر
        </Link>
      </div>
    </article>
  );
}
