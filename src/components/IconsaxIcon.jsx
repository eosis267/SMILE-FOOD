import React from 'react';

/**
 * SMILE FOOD — Iconsax Icon System
 * Standardized SVG icon components adhering strictly to Iconsax geometry & style specs.
 * Supports: 'linear', 'bold', 'outline' variants with custom size and color props.
 */
export const IconsaxIcon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  variant = 'linear', 
  className = '' 
}) => {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: `inline-block shrink-0 transition-colors ${className}`
  };

  switch (name) {
    // ─── BRAND LOGO ──────────────────────────────────────────
    case 'brand-smile':
    case 'smile-logo':
      return (
        <svg {...iconProps}>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M7 13.5C8.5 16.5 11 17.5 14 16.5" stroke={color === 'white' ? '#D5F28A' : '#079B48'} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="8" cy="9.5" r="1.5" fill={color} />
          <circle cx="15" cy="8.5" r="1.5" fill={color} />
        </svg>
      );

    // ─── NAVIGATION & DASHBOARD ──────────────────────────────
    case 'overview':
    case 'dashboard':
    case 'grid':
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="2.5" width="8" height="8" rx="2.5" stroke={color} strokeWidth="1.8" />
          <rect x="13.5" y="2.5" width="8" height="8" rx="2.5" stroke={color} strokeWidth="1.8" />
          <rect x="2.5" y="13.5" width="8" height="8" rx="2.5" stroke={color} strokeWidth="1.8" />
          <rect x="13.5" y="13.5" width="8" height="8" rx="2.5" stroke={color} strokeWidth="1.8" />
        </svg>
      );

    case 'orders':
    case 'clipboard':
    case 'receipt':
      return (
        <svg {...iconProps}>
          <path d="M8 2V5M16 2V5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <rect x="3.5" y="4" width="17" height="17" rx="4" stroke={color} strokeWidth="1.8" />
          <path d="M7.5 10H16.5M7.5 14H13.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'messages':
    case 'mail':
    case 'sms':
      return (
        <svg {...iconProps}>
          <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke={color} strokeWidth="1.8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke={color} strokeWidth="1.8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    case 'statistics':
    case 'chart':
    case 'chart-21':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="4.5" stroke={color} strokeWidth="1.8" />
          <path d="M8 17V12M12 17V8M16 17V14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'profile':
    case 'user':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="7.5" r="4" stroke={color} strokeWidth="1.8" />
          <path d="M4 19.5C4 16.5 7.5 14.5 12 14.5C16.5 14.5 20 16.5 20 19.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'settings':
    case 'setting-2':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'help':
    case 'info':
    case 'info-circle':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
          <path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // ─── WALLET, MONEY & PAYMENTS ─────────────────────────────
    case 'wallet':
    case 'money':
    case 'empty-wallet':
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="5.5" width="19" height="14" rx="3.5" stroke={color} strokeWidth="1.8" />
          <path d="M2.5 9.5H21.5" stroke={color} strokeWidth="1.8" />
          <circle cx="16.5" cy="14" r="1.5" fill={color} />
        </svg>
      );

    case 'card':
    case 'card-pos':
    case 'credit-card':
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="5" width="19" height="14" rx="3.5" stroke={color} strokeWidth="1.8" />
          <path d="M2.5 10H21.5" stroke={color} strokeWidth="1.8" />
          <path d="M6.5 15H9.5M13.5 15H17.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'bank':
    case 'building-4':
      return (
        <svg {...iconProps}>
          <path d="M3 9.5L12 3.5L21 9.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 10V18M8 10V18M12 10V18M16 10V18M20 10V18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M2 21H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'mobile':
    case 'call':
    case 'ussd':
      return (
        <svg {...iconProps}>
          <rect x="6" y="2.5" width="12" height="19" rx="3.5" stroke={color} strokeWidth="1.8" />
          <path d="M10.5 5.5H13.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1" fill={color} />
        </svg>
      );

    case 'trend-up':
      return (
        <svg {...iconProps}>
          <path d="M4 16L10.5 9.5L14.5 13.5L20 8M20 8H15M20 8V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'trend-down':
      return (
        <svg {...iconProps}>
          <path d="M4 8L10.5 14.5L14.5 10.5L20 16M20 16H15M20 16V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ─── ARROWS & DIRECTIONS ──────────────────────────────────
    case 'arrow-left':
    case 'arrow-left-2':
      return (
        <svg {...iconProps}>
          <path d="M15 19L8.5 12.5C7.9 11.9 7.9 11.1 8.5 10.5L15 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-right':
    case 'arrow-right-2':
      return (
        <svg {...iconProps}>
          <path d="M9 5L15.5 11.5C16.1 12.1 16.1 12.9 15.5 13.5L9 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-up':
      return (
        <svg {...iconProps}>
          <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-down':
      return (
        <svg {...iconProps}>
          <path d="M12 5V19M12 19L18 13M12 19L6 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'chevron-down':
      return (
        <svg {...iconProps}>
          <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'chevron-up':
      return (
        <svg {...iconProps}>
          <path d="M6 15L12 9L18 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ─── ACTIONS, CONTROLS & UTILITIES ────────────────────────
    case 'add':
    case 'plus':
      return (
        <svg {...iconProps}>
          <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'close':
    case 'close-circle':
    case 'failed':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
          <path d="M9 9L15 15M15 9L9 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'check':
    case 'tick':
      return (
        <svg {...iconProps}>
          <path d="M5 13L9 17L19 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'check-circle':
    case 'completed':
    case 'tick-circle':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
          <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'clock':
    case 'clock-circle':
    case 'pending':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
          <path d="M12 7V12L15 13.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'warning':
    case 'warning-2':
    case 'danger':
      return (
        <svg {...iconProps}>
          <path d="M12 3.5L21 19.5H3L12 3.5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9V14M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'search':
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
          <path d="M16 16L20.5 20.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'filter':
      return (
        <svg {...iconProps}>
          <path d="M3 5H21M6 12H18M10 19H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'bell':
    case 'notification':
      return (
        <svg {...iconProps}>
          <path d="M18 8C18 6.4 17.3 4.8 16.2 3.7C15.1 2.6 13.6 2 12 2C10.4 2 8.8 2.6 7.7 3.7C6.6 4.8 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 20C13.55 20.3 13.3 20.56 13 20.73C12.7 20.9 12.35 21 12 21C11.64 21 11.29 20.9 11 20.73C10.7 20.56 10.45 20.3 10.27 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    case 'calendar':
      return (
        <svg {...iconProps}>
          <rect x="3" y="4.5" width="18" height="16" rx="4" stroke={color} strokeWidth="1.8" />
          <path d="M8 2.5V5.5M16 2.5V5.5M3 9.5H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'pdf':
    case 'export':
      return (
        <svg {...iconProps}>
          <path d="M12 3V14M12 14L8 10M12 14L16 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16V18.5C4 19.88 5.12 21 6.5 21H17.5C18.88 21 20 19.88 20 18.5V16" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'copy':
      return (
        <svg {...iconProps}>
          <rect x="8" y="8" width="13" height="13" rx="3" stroke={color} strokeWidth="1.8" />
          <path d="M4 16V5C4 4 5 3 6 3H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'gift':
      return (
        <svg {...iconProps}>
          <rect x="3" y="10" width="18" height="11" rx="2.5" stroke={color} strokeWidth="1.8" />
          <path d="M12 10V21M3 14H21" stroke={color} strokeWidth="1.8" />
          <path d="M8 10C6.5 10 5.5 8.5 6.5 7C7.5 5.5 10 7.5 12 10C14 7.5 16.5 5.5 17.5 7C18.5 8.5 17.5 10 16 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'shield-check':
    case 'security-safe':
      return (
        <svg {...iconProps}>
          <path d="M12 2L4 5.5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5.5L12 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'lock':
    case 'security':
      return (
        <svg {...iconProps}>
          <rect x="5" y="10" width="14" height="11" rx="3" stroke={color} strokeWidth="1.8" />
          <path d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="15.5" r="1.5" fill={color} />
        </svg>
      );

    case 'eye':
      return (
        <svg {...iconProps}>
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="1.8"/>
        </svg>
      );

    case 'eye-slash':
      return (
        <svg {...iconProps}>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12A18.45 18.45 0 015.06 5.06M9.9 4.24A9.12 9.12 0 0112 4C19 4 23 12 23 12A18.5 18.5 0 0120.75 16M14.12 14.12A3 3 0 119.88 9.88" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="2" y1="2" x2="22" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );

    case 'box':
    case 'package':
      return (
        <svg {...iconProps}>
          <path d="M12 2.5L20 7V17L12 21.5L4 17V7L12 2.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 11.5V21M12 11.5L20 7M12 11.5L4 7" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );

    case 'moon':
      return (
        <svg {...iconProps}>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'sun':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.8" />
          <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'more':
      return (
        <svg {...iconProps}>
          <circle cx="6" cy="12" r="1.5" fill={color} />
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <circle cx="18" cy="12" r="1.5" fill={color} />
        </svg>
      );

    case 'edit':
      return (
        <svg {...iconProps}>
          <path d="M11 4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H18C19.1 22 20 21.1 20 20V13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'trash':
      return (
        <svg {...iconProps}>
          <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19L19 7M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'refresh':
      return (
        <svg {...iconProps}>
          <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C16.14 2 19.68 4.52 21.17 8.12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M22 4V8H18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'loading':
    case 'spinner':
      return (
        <svg {...iconProps} className={`animate-spin ${className}`}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="40 20" />
        </svg>
      );

    case 'google':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
      );

    // ─── ROLES / MARKETPLACE ──────────────────────────────────
    case 'shop':
    case 'restaurant':
      return (
        <svg {...iconProps}>
          <path d="M3 9L4.5 4H19.5L21 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 9C3 10.7 4.3 12 6 12C7.7 12 9 10.7 9 9C9 10.7 10.3 12 12 12C13.7 12 15 10.7 15 9C15 10.7 16.3 12 18 12C19.7 12 21 10.7 21 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 12V20H19V12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'scooter':
    case 'delivery':
    case 'rider':
      return (
        <svg {...iconProps}>
          <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="1.8" />
          <circle cx="18" cy="18" r="3" stroke={color} strokeWidth="1.8" />
          <path d="M6 18H10L14 10H17M15 7H18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'heart':
    case 'donor':
    case 'ngo':
      return (
        <svg {...iconProps}>
          <path d="M12 20.5C12 20.5 3 15.5 3 9C3 6 5.5 3.5 8.5 3.5C10.24 3.5 11.91 4.5 12 5C12.09 4.5 13.76 3.5 15.5 3.5C18.5 3.5 21 6 21 9C21 15.5 12 20.5 12 20.5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'database':
    case 'server':
      return (
        <svg {...iconProps}>
          <ellipse cx="12" cy="5" rx="8" ry="3" stroke={color} strokeWidth="1.8" />
          <path d="M4 5V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V5" stroke={color} strokeWidth="1.8" />
          <path d="M4 12V19C4 20.66 7.58 22 12 22C16.42 22 20 20.66 20 19V12" stroke={color} strokeWidth="1.8" />
        </svg>
      );

    case 'star':
    case 'star-1':
      return (
        <svg {...iconProps}>
          <path d="M12 2L14.85 8.26L21.75 9.07L16.63 13.84L18.01 20.66L12 17.27L5.99 20.66L7.37 13.84L2.25 9.07L9.15 8.26L12 2Z" fill={variant === 'bold' ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'location':
    case 'map-pin':
    case 'gps':
      return (
        <svg {...iconProps}>
          <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke={color} strokeWidth="1.8" />
          <path d="M3.62 8.49C5.59 -0.17 18.42 -0.16 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke={color} strokeWidth="1.8" />
        </svg>
      );

    case 'cart':
    case 'shopping-cart':
    case 'bag':
      return (
        <svg {...iconProps}>
          <path d="M2 2H4.74L6.96 14.51C7.07 15.14 7.61 15.6 8.25 15.6H18.91C19.52 15.6 20.04 15.18 20.18 14.58L21.84 7.37C21.99 6.72 21.49 6.12 20.82 6.12H5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="19.5" r="1.5" fill={color} />
          <circle cx="18" cy="19.5" r="1.5" fill={color} />
        </svg>
      );

    case 'cup':
    case 'drink':
    case 'coffee':
      return (
        <svg {...iconProps}>
          <path d="M2 8H18V14C18 17.31 15.31 20 12 20H8C4.69 20 2 17.31 2 14V8Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 10H19C20.66 10 22 11.34 22 13C22 14.66 20.66 16 19 16H18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 2V5M10 2V5M14 2V5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'cake':
    case 'snack':
      return (
        <svg {...iconProps}>
          <path d="M3 21H21M4 21V12C4 10.9 4.9 10 6 10H18C19.1 10 20 10.9 20 12V21M7 10V7C7 5.9 7.9 5 9 5H15C16.1 5 17 5.9 17 7V10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 2V5M4 15C5.5 16 6.5 16 8 15C9.5 14 10.5 14 12 15C13.5 16 14.5 16 16 15C17.5 14 18.5 14 20 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'food':
    case 'dish':
    case 'fork-spoon':
      return (
        <svg {...iconProps}>
          <path d="M3 3V8C3 10.21 4.79 12 7 12V21M7 3V12M11 3V8C11 10.21 9.21 12 7 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 3V21M17 3C15.34 3 14 4.79 14 7V11C14 12.1 14.9 13 16 13H18C19.1 13 20 12.1 20 11V7C20 4.79 18.66 3 17 3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'truck':
    case 'delivery-truck':
      return (
        <svg {...iconProps}>
          <path d="M2 5H14V17H2V5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 9H18.5L21 12.5V17H14V9Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="2" stroke={color} strokeWidth="1.8" />
          <circle cx="17" cy="18" r="2" stroke={color} strokeWidth="1.8" />
        </svg>
      );

    case 'flash':
    case 'fire':
      return (
        <svg {...iconProps}>
          <path d="M13 2L4 13H11L10 22L20 10H13L14 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'pin':
    case 'note':
      return (
        <svg {...iconProps}>
          <path d="M16 3L21 8L18 11L17 10L14 13V17L12 19L7 14L9 12H13L16 9L15 8L18 5L16 3ZM9 17L3 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
        </svg>
      );
  }
};

export default IconsaxIcon;
