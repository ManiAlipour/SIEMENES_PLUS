import Link from "next/link";
import { ArrowLeft, BadgeCheck, Box, MessageCircle, ShieldCheck, Wrench } from "lucide-react";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import Product from "@/models/Product";
import Review from "@/models/Review";
import TrackLookupForm from "./TrackLookupForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "پیگیری تعمیرات | زیمنس پلاس", description: "پیگیری آنلاین و امن وضعیت تعمیر تجهیزات زیمنس با کد اختصاصی یا QR کد." };

async function getFeaturedComments() {
  try {
    await connectDB();
    const [comments, reviews] = await Promise.all([
      Comment.find({ approved: true, modelNumber: { $exists: true, $ne: "" } }).sort({ createdAt: -1 }).limit(6).populate("user", "name").lean(),
      Review.find({ approved: true, rating: { $gte: 4 } }).sort({ rating: -1, createdAt: -1 }).limit(6).populate("user", "name").populate("product", "name slug modelNumber").lean(),
    ]);
    const modelNumbers = [...new Set(comments.map((item: any) => String(item.modelNumber).trim()).filter(Boolean))];
    const products = await Product.find({ modelNumber: { $in: modelNumbers } }).select("name slug modelNumber").lean();
    const productByModel = new Map(products.map((item: any) => [String(item.modelNumber).toLowerCase(), item]));
    const selectedComments = comments.map((item: any) => ({ text: item.text, modelNumber: item.modelNumber, customer: item.user?.name || "مشتری زیمنس پلاس", product: productByModel.get(String(item.modelNumber).toLowerCase()) }));
    const selectedReviews = reviews.map((item: any) => ({ text: item.text, modelNumber: item.product?.modelNumber || "", customer: item.user?.name || "مشتری زیمنس پلاس", product: item.product, rating: item.rating }));
    return [...selectedReviews, ...selectedComments].filter((item, index, list) => list.findIndex((entry) => entry.text === item.text) === index).slice(0, 3);
  } catch (error) {
    console.error("Could not load featured repair testimonials", error);
    return [];
  }
}

export default async function TrackLandingPage() {
  const comments = await getFeaturedComments();
  return <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f5f8fc] text-slate-900">
    <section className="relative isolate overflow-hidden bg-[#071b3a] px-4 pb-20 pt-10 text-white sm:px-8 sm:pb-28 sm:pt-14">
      <div className="absolute -left-24 -top-28 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"/><div className="absolute -bottom-40 right-1/3 -z-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"/>
      <div className="mx-auto max-w-6xl"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"><Wrench size={18}/> زیمنس پلاس</Link>
        <div className="grid items-center gap-10 pt-12 md:grid-cols-[1.1fr_.9fr] md:pt-16"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-100"><ShieldCheck size={15}/> پیگیری امن با لینک اختصاصی</div><h1 className="mt-5 max-w-2xl text-3xl font-black leading-[1.5] sm:text-5xl">وضعیت تعمیر تجهیزتان را <span className="text-cyan-300">شفاف و لحظه‌ای</span> دنبال کنید</h1><p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">کد پیگیری پیامک‌شده را وارد کنید یا QR روی لیبل را با دوربین گوشی اسکن کنید تا روند تعمیر همان دستگاه را ببینید.</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-blue-100/75"><span className="inline-flex items-center gap-1.5"><BadgeCheck size={15}/> بدون ساخت حساب</span><span className="inline-flex items-center gap-1.5"><Box size={15}/> لینک اختصاصی هر تعمیر</span></div></div>
          <div className="rounded-[1.75rem] bg-white p-5 text-slate-900 shadow-2xl shadow-blue-950/40 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-blue-700">مرکز پیگیری آنلاین</p><h2 className="mt-1 text-xl font-extrabold">تعمیر من کجاست؟</h2></div><span className="rounded-2xl bg-blue-50 p-3 text-blue-700"><SearchIcon/></span></div><TrackLookupForm/><div className="mt-4 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">لینک پیگیری در پیامک پذیرش برایتان ارسال شده است. بازکردن لینک پیامک هم مستقیم شما را به همین صفحه می‌برد.</div></div>
        </div>
      </div>
    </section>
    <section className="mx-auto -mt-7 grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-8"><Step number="۱" title="دریافت و بررسی" text="ثبت پذیرش و بررسی اولیه تجهیز"/><Step number="۲" title="تعمیر تخصصی" text="عیب‌یابی و انجام تعمیر توسط کارشناس"/><Step number="۳" title="تست و تحویل" text="تأیید عملکرد و آماده‌سازی برای ارسال"/></section>
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">تجربه مشتریان</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">اعتمادی که با تجربه ساخته می‌شود</h2><p className="mt-2 text-sm text-slate-500">نظرهای ثبت‌شده برای تجهیزات و مدل‌های مختلف</p></div><Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">مشاهده محصولات <ArrowLeft size={16}/></Link></div>
      {comments.length ? <div className="mt-7 grid gap-4 md:grid-cols-3">{comments.map((comment:any,index:number)=><article key={`${comment.modelNumber}-${index}`} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><MessageCircle className="text-cyan-600" size={22}/>{comment.rating && <span aria-label={`امتیاز ${comment.rating} از ۵`} className="text-amber-500">{"★".repeat(comment.rating)}<span className="text-slate-200">{"★".repeat(5-comment.rating)}</span></span>}</div><p className="mt-4 flex-1 text-sm leading-7 text-slate-700">«{comment.text}»</p><div className="mt-5 border-t border-slate-100 pt-4"><p className="text-sm font-bold">{comment.customer}</p><p className="mt-1 text-xs text-slate-500">مدل {comment.modelNumber}</p>{comment.product?.slug && <Link href={`/shop/${comment.product.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">مشاهده صفحه محصول <ArrowLeft size={13}/></Link>}</div></article>)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">نظرهای تأییدشده برای نمایش به‌زودی اینجا قرار می‌گیرند.</div>}
    </section>
    <section className="bg-white px-4 py-10 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-extrabold">برای تعمیر تجهیزتان راهنمایی می‌خواهید؟</h2><p className="mt-1 text-sm text-slate-500">کارشناسان زیمنس پلاس آماده پاسخگویی هستند.</p></div><div className="flex flex-wrap gap-3"><Link href="/contact-us" className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">ثبت درخواست تعمیر</Link><a href="tel:09129637779" dir="ltr" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">۰۹۱۲۹۶۳۷۷۷۹</a></div></div></section>
  </main>;
}

function SearchIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>}
function Step({number,title,text}:{number:string;title:string;text:string}){return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/60"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">{number}</span><h3 className="mt-3 font-extrabold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></article>}
