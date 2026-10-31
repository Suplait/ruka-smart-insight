import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ONE_CONTACT_PATH } from "@/content/oneContent";

type OneCtaProps = {
  label: string;
  size?: "md" | "lg";
  className?: string;
  to?: string;
};

/** Primary action: always hsl(var(--primary)), always a real route. */
export function OneCta({ label, size = "md", className, to = ONE_CONTACT_PATH }: OneCtaProps) {
  return (
    <Link to={to} className={cn("one-cta", size === "lg" && "one-cta--lg", className)}>
      <span className="one-cta__tile" aria-hidden="true" />
      {label}
    </Link>
  );
}
