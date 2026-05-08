import { Logo } from "./Logo";

export function Preloader({ label = "Loading Sonic AI..." }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] gap-4">
      <Logo className="h-20 w-20" spin />
      <p className="text-sm text-gray-400 animate-pulse">{label}</p>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0F1012] p-6 space-y-4 animate-pulse">
      <div className="h-10 w-1/3 rounded-lg bg-[#1F2023]" />
      <div className="h-6 w-1/2 rounded-lg bg-[#1F2023]" />
      <div className="grid gap-3 mt-6">
        <div className="h-24 rounded-2xl bg-[#1F2023]" />
        <div className="h-24 rounded-2xl bg-[#1F2023]" />
        <div className="h-24 rounded-2xl bg-[#1F2023]" />
      </div>
    </div>
  );
}
