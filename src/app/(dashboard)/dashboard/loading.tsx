export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-b-transparent animate-spin"></div>
        <div className="absolute inset-[8px] bg-white/60 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
      </div>

      {/* Text */}
      <p className="mt-6 text-meuted text-sm sm:text-base font-[Vazirmatn] font-semibold tracking-wide">
        در حال بارگذاری اطلاعات کاربری...
      </p>

      {/* Loading subtitle */}
      <p className="mt-2 text-primary/70 text-xs sm:text-sm font-[Vazirmatn]">
        لطفاً چند لحظه صبر کنید
      </p>
    </div>
  );
}
