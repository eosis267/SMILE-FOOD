import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IconsaxIcon from '../../components/IconsaxIcon';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DISHES_CATALOG } from './CustomerExplorePage';

export const CustomerHomePage = () => {
  const { showToast } = useApp();
  const { displayName } = useAuth();
  const [search, setSearch] = useState('');

  const categories = ['All', 'Rice & Jollof', 'Grills & Suya', 'Soups & Swallows', 'Grills & Seafood', 'Drinks'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = DISHES_CATALOG.filter(d => {
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  }).slice(0, 6);

  const handleAddToCart = (dish) => {
    try {
      const cart = JSON.parse(localStorage.getItem('smilefood_cart') || '[]');
      const idx = cart.findIndex(i => i.id === dish.id);
      if (idx > -1) {
        cart[idx].quantity += 1;
      } else {
        cart.push({ ...dish, quantity: 1 });
      }
      localStorage.setItem('smilefood_cart', JSON.stringify(cart));
      showToast(`${dish.name} added to cart!`, 'success');
    } catch {
      showToast(`${dish.name} added to cart!`, 'success');
    }
  };


  const promotions = [
    { label: '30% OFF', title: 'First Order Free Delivery', sub: 'Use code: SMILE30', color: '#079B48' },
    { label: 'HOT SPECIAL', title: 'Weekend Party Jollof', sub: 'Available all weekend', color: '#F28C00' },
  ];

  return (
    <div className="space-y-7">
      {/* Greeting Header */}
      <div>
        <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
          Hey {displayName.split(' ')[0]}!
        </h1>
        <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
          What would you like to eat today?
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <IconsaxIcon name="search" size={18} color="#AAAAAA" className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search restaurants or dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-[52px] pl-11 pr-4 rounded-[18px] bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] text-[14px] text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:ring-2 focus:ring-[#079B48]/10 transition-all shadow-sm"
        />
        <Link
          to="/customer/explore"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-[12px] bg-[#079B48] text-white text-[12px] font-bold hover:bg-[#087F3C] transition-colors"
        >
          Explore All
        </Link>
      </div>

      {/* Promo Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.title}
            className="relative rounded-[22px] p-5 text-white overflow-hidden shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
            style={{ background: `linear-gradient(135deg, ${promo.color}dd, ${promo.color}99)` }}
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wide mb-2">
              {promo.label}
            </span>
            <p className="text-[17px] font-extrabold font-['Outfit'] leading-tight">{promo.title}</p>
            <p className="text-[12px] text-white/80 mt-1">{promo.sub}</p>
          </div>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
              activeCategory === cat
                ? 'bg-[#079B48] text-white shadow-md shadow-[#079B48]/20'
                : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] border border-[#EEEEEE] dark:border-[#27332A] hover:border-[#079B48] hover:text-[#079B48]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dish Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            {activeCategory === 'All' ? 'Popular Near You' : activeCategory}
          </h2>
          <Link to="/customer/explore" className="text-[13px] font-bold text-[#079B48] hover:underline flex items-center gap-1">
            <span>See all</span>
            <IconsaxIcon name="arrow-right" size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dish) => (
            <div key={dish.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[22px] overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-[#171917]">
                  {dish.prepTime}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-[#181F1A]/90 backdrop-blur-sm text-[11px] font-bold text-[#F28C00]">
                  <IconsaxIcon name="star" size={12} color="#F28C00" />
                  <span>{dish.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[13px] font-semibold text-[#079B48] mb-1">{dish.restaurant}</p>
                <p className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] leading-tight mb-2">{dish.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[17px] font-black text-[#079B48] font-['Outfit']">₦{(dish.price * 100).toLocaleString()}</p>
                  <button
                    onClick={() => handleAddToCart(dish)}
                    className="w-9 h-9 rounded-full bg-[#079B48] flex items-center justify-center text-white hover:bg-[#087F3C] hover:scale-110 transition-all active:scale-95 shadow-md shadow-[#079B48]/25"
                  >
                    <IconsaxIcon name="add" size={18} color="white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'My Orders', icon: 'orders', to: '/customer/orders', color: '#079B48', bg: '#EAF8D8' },
          { label: 'My Cart', icon: 'box', to: '/customer/cart', color: '#F28C00', bg: '#FEF5E7' },
          { label: 'Track Delivery', icon: 'scooter', to: '/customer/track', color: '#087F3C', bg: '#D5F8E0' },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[20px] hover:shadow-md hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ background: link.bg }}>
              <IconsaxIcon name={link.icon} size={24} color={link.color} />
            </div>
            <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] text-center">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomerHomePage;
