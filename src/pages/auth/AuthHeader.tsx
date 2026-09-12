import React from 'react';
import { useRouter } from '../../router/Router';
import { ArrowLeft } from 'lucide-react';

interface AuthHeaderProps {
  actionText?: string;
  buttonText: string;
  buttonAction: () => void;
  showBackIcon?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  actionText,
  buttonText,
  buttonAction,
  showBackIcon = false,
}) => {
  const { navigate } = useRouter();

  return (
    <header className="zameria-auth-header">
      <div className="zameria-auth-header-inner">
        {/* Main Logo — Links back to Landing Page */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="zameria-auth-header-logo-link"
          aria-label="ZAMERIA Home"
        >
          <img
            src="/zameria-logo-header.png"
            alt="ZAMERIA"
            className="zameria-auth-header-logo"
          />
        </a>

        {/* Action Button & Prompt */}
        <div className="zameria-auth-header-right">
          {actionText && (
            <span className="zameria-auth-header-prompt">
              {actionText}
            </span>
          )}
          <button
            type="button"
            onClick={buttonAction}
            className="zameria-auth-header-btn"
          >
            {showBackIcon && <ArrowLeft size={15} />}
            <span>{buttonText}</span>
          </button>
        </div>
      </div>

      <style>{`
        .zameria-auth-header {
          width: 100%;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .zameria-auth-header-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          min-height: 64px;
        }

        .zameria-auth-header-logo-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }

        .zameria-auth-header-logo {
          height: 28px;
          width: auto;
          object-fit: contain;
          display: block;
          transition: opacity 0.15s ease;
        }

        .zameria-auth-header-logo-link:hover .zameria-auth-header-logo {
          opacity: 0.85;
        }

        .zameria-auth-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .zameria-auth-header-prompt {
          font-size: 13.5px;
          color: #64748b;
          white-space: nowrap;
        }

        .zameria-auth-header-btn {
          font-size: 13px;
          font-weight: 700;
          color: #071A31;
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
          transition: all 0.18s ease;
          min-height: 38px;
          user-select: none;
        }

        .zameria-auth-header-btn:hover {
          background-color: #e2e8f0;
          border-color: #cbd5e1;
        }

        /* Responsive Breakpoints */
        @media (max-width: 640px) {
          .zameria-auth-header-inner {
            padding: 12px 18px;
            min-height: 56px;
          }

          .zameria-auth-header-logo {
            height: 24px;
          }

          /* Hide secondary prompt on mobile to guarantee zero horizontal overflow and zero line wraps */
          .zameria-auth-header-prompt {
            display: none !important;
          }

          .zameria-auth-header-btn {
            padding: 6px 14px;
            font-size: 12.5px;
            min-height: 36px;
          }
        }

        @media (max-width: 360px) {
          .zameria-auth-header-inner {
            padding: 10px 14px;
            min-height: 52px;
          }

          .zameria-auth-header-logo {
            height: 22px;
          }

          .zameria-auth-header-btn {
            padding: 5px 12px;
            font-size: 12px;
            min-height: 34px;
          }
        }
      `}</style>
    </header>
  );
};

export default AuthHeader;
