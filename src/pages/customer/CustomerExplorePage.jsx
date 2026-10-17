import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';
import { EXPANDED_FOOD_CATALOGUE, FOOD_CATEGORIES } from '../../data/foodCatalogue';

export const DISHES_CATALOG = EXPANDED_FOOD_CATALOGUE;

export const CustomerExplorePage = () => {
  const { showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smilefood_cart') || '[]');
    } catch {
      return [];
    }
  });

  const categories = FOOD_CATEGORIES;

  const filteredDishes = EXPANDED_FOOD_CATALOGUE.filter(dish => {
    const matchesCat = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(search.toLowerCase()) || 
                          dish.restaurant.toLowerCase().includes(search.toLowerCase()) ||
                          dish.subCategory?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      let updated;
      if (existing) {
        updated = prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        updated = [...prev, { ...dish, quantity: 1 }];
      }
      localStorage.setItem('smilefood_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added ${dish.name} to cart!`, 'success');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/customer" label="Home" />
          </div>
          <h2 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Explore Restaurants & Dishes
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Discover culinary specials crafted by verified kitchens and delivered fresh to your door
          </p>
        </div>

        <Link
          to="/customer/cart"
          className="h-11 px-6 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center gap-2.5 self-start sm:self-auto"
        >
          <IconsaxIcon name="orders" size={18} color="white" />
          <span>View Cart ({totalCartCount})</span>
        </Link>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="smile-card p-3.5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl flex items-center gap-3">
          <IconsaxIcon name="search" size={18} color="#777D79" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cravings, dishes, or restaurant kitchens..."
            className="w-full bg-transparent text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear Search" className="text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2]">
              <IconsaxIcon name="close" size={14} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-[13px] font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#079B48] text-white shadow-sm'
                  : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] hover:bg-[#EAF8D8] hover:text-[#079B48] border border-[#EEEEEE] dark:border-[#27332A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map(dish => (
          <div
            key={dish.id}
            className="smile-card group bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] overflow-hidden hover:shadow-xl hover:shadow-[#079B48]/5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Container with Badges */}
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#181F1A]/90 backdrop-blur-xs text-[11px] font-bold text-[#079B48] shadow-xs">
                  {dish.prepTime}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#171917]/80 backdrop-blur-xs text-[11px] font-bold text-[#D5F28A] flex items-center gap-1 shadow-xs">
                  <IconsaxIcon name="star" size={12} color="#D5F28A" />
                  <span>{dish.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#079B48] dark:text-[#D5F28A] mb-1">
                  {dish.restaurant}
                </p>
                <h3 className="text-[17px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] leading-snug mb-1.5">
                  {dish.name}
                </h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="p-5 pt-0 flex items-center justify-between border-t border-[#EEEEEE]/60 dark:border-[#27332A]/60 mt-2">
              <div className="text-[20px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                ₦{dish.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
              <button
                onClick={() => addToCart(dish)}
                className="px-4 py-2 rounded-2xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <IconsaxIcon name="add" size={14} color="white" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerExplorePage;
