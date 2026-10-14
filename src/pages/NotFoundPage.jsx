import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IconsaxIcon from '../components/IconsaxIcon';

const NotFoundPage = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex flex-col items-center justify-center px-4 text-center transition-colors">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#079B48]/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-12 group">
          <div className="w-10 h-10 rounded-2xl bg-[#079B48] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <IconsaxIcon name="brand-smile" size={22} color="white" />
          </div>
          <span className="font-extrabold text-[20px] tracking-tight text-[#079B48] font-['Outfit']">SMILE FOOD</span>
        </Link>

        {/* 404 illustration */}
        <div
          className="w-36 h-36 rounded-[40px] bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] shadow-2xl flex items-center justify-center mb-8 cursor-pointer transition-transform duration-300"
          style={{ transform: hovered ? 'rotate(-6deg) scale(1.05)' : 'rotate(0deg) scale(1)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconsaxIcon name="warning" size={64} color="#F28C00" />
        </div>

        {/* Heading */}
        <h1 className="text-[80px] font-extrabold font-['Outfit'] text-[#079B48] leading-none mb-4">404</h1>
        <h2 className="text-[28px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-3">
          Page Not Found
        </h2>
        <p className="text-[16px] text-[#777D79] dark:text-[#8E9A92] mb-10 max-w-md leading-relaxed">
          Oops! Looks like this page went out for delivery and never came back. Let's get you back to somewhere tasty.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#079B48] text-white text-[15px] font-bold hover:bg-[#087F3C] shadow-xl shadow-[#079B48]/25 transition-all hover:scale-105 active:scale-95"
          >
            <IconsaxIcon name="home" size={18} color="white" />
            Go Home
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#EEEEEE] dark:border-[#27332A] text-[#777D79] dark:text-[#8E9A92] text-[15px] font-bold hover:bg-white dark:hover:bg-[#181F1A] hover:text-[#171917] dark:hover:text-[#F0F5F2] transition-all"
          >
            <IconsaxIcon name="login" size={18} />
            Sign In
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[13px] font-semibold text-[#777D79] dark:text-[#8E9A92]">
          {[
            { label: 'Explore Food', to: '/login' },
            { label: 'Restaurants', to: '/login' },
            { label: 'Sign Up', to: '/signup' },
            { label: 'Help', to: '/login' },
          ].map(l => (
            <Link key={l.label} to={l.to} className="hover:text-[#079B48] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
