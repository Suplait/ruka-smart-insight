import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

type OneCtaProps = {
  children: React.ReactNode;
  to?: string;
  compact?: boolean;
  block?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

/** Primary CTA for Ruka One. Keeps Ruka's current primary color; everything else is One's own. */
export function OneCta({ children, to, compact, block, className, type = "button", disabled, onClick }: OneCtaProps) {
  const classes = cn("one-cta", compact && "one-cta--compact", block && "one-cta--block", className);
  const content = (
    <>
      <span className="one-cta__label">{children}</span>
      <span className="one-cta__arrow"><Arrow /><Arrow /></span>
    </>
  );

  if (to) {
    return <Link to={to} className={classes} onClick={onClick}>{content}</Link>;
  }

  return <button type={type} className={classes} disabled={disabled} onClick={onClick}>{content}</button>;
}
