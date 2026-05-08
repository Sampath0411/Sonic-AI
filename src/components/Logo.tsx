import logo from "@/assets/sonic-logo.png";

export function Logo({
  className = "h-8 w-8",
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <img
      src={logo}
      alt="Sonic AI"
      className={`${className} ${spin ? "animate-spin-slow" : ""}`}
    />
  );
}
