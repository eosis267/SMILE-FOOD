import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconsaxIcon from './IconsaxIcon';

/**
 * SMILE FOOD — Global Back Button
 * Prominent back button using router history with fallback to explicit parent route.
 * Required on every non-root dashboard page per master prompt Section 3.
 */
const BackButton = ({ fallbackTo = '/', label = 'Back' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Use browser history if available, otherwise navigate to fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo, { replace: true });
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-[30px] bg-[#F3F6F5] dark:bg-[#202922] text-[#014C32] dark:text-[#D5F28A] text-[13px] font-bold hover:bg-[#E7EEEC] dark:hover:bg-[#27332A] transition-all active:scale-[0.97] border border-transparent hover:border-[#D5F28A]/50"
      aria-label={`Go ${label}`}
    >
      <IconsaxIcon name="arrow-left" size={16} />
      {label}
    </button>
  );
};

export default BackButton;
