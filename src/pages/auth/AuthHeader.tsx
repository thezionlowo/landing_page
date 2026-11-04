import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandMark } from "../../components/SiteChrome";

interface AuthHeaderProps {
  actionText?: string;
  buttonText: string;
  buttonAction: () => void;
  showBackIcon?: boolean;
}

export function AuthHeader({
  actionText,
  buttonText,
  buttonAction,
  showBackIcon = false,
}: AuthHeaderProps) {
  return (
    <header className="zameria-auth-header">
      <div className="zameria-auth-header-inner hm-wrap">
        <BrandMark />
        <div className="zameria-auth-header-right">
          {actionText && (
            <span className="zameria-auth-header-prompt">{actionText}</span>
          )}
          <button
            type="button"
            onClick={buttonAction}
            className="hm-button hm-button-small hm-button-outline zameria-auth-header-btn"
          >
            {showBackIcon && <ArrowLeft size={14} />}
            <span>{buttonText}</span>
            {!showBackIcon && <ArrowUpRight size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
