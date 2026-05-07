import logo from "@/assets/sonic-logo.png";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return <img src={logo} alt="Sonic AI" className={className} />;
}
