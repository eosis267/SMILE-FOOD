import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconsaxIcon from '../components/IconsaxIcon';
import { EXPANDED_FOOD_CATALOGUE, FOOD_CATEGORIES } from '../data/foodCatalogue';

// ── Public Navbar ─────────────────────────────────────────────────────────────
const PublicNavbar = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Explore Food', id: 'menu' },
    { label: 'Restaurants', id: 'restaurants' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Contact', id: 'contact' },
  ];

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-[#181F1A]/95 backdrop-blur-md shadow-sm border-b border-[#EEEEEE] dark:border-[#27332A]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#079B48] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <IconsaxIcon name="brand-smile" size={20} color="white" />
          </div>
          <span className="font-extrabold text-[20px] tracking-tight text-[#079B48] font-['Outfit']">SMILE FOOD</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${
                scrolled
                  ? 'text-[#777D79] dark:text-[#8E9A92] hover:text-[#079B48]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all ${
              scrolled
                ? 'text-[#079B48] border border-[#079B48]/30 hover:bg-[#EAF8D8] dark:hover:bg-[#14301C]'
                : 'text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-full bg-[#079B48] text-white text-[14px] font-bold hover:bg-[#087F3C] shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Sign Up Free
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <IconsaxIcon name={menuOpen ? 'close' : 'menu'} size={22} color={scrolled ? '#171917' : 'white'} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#181F1A] border-t border-[#EEEEEE] dark:border-[#27332A] px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              className="w-full text-left px-4 py-3 rounded-xl text-[14px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] hover:text-[#079B48] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 pt-3 border-t border-[#EEEEEE] dark:border-[#27332A]">
            <Link to="/login" className="flex-1 h-11 flex items-center justify-center rounded-full border border-[#079B48]/30 text-[#079B48] text-[14px] font-bold">Log In</Link>
            <Link to="/signup" className="flex-1 h-11 flex items-center justify-center rounded-full bg-[#079B48] text-white text-[14px] font-bold">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

// ── Hero Section ──────────────────────────────────────────────────────────────
const HeroSection = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [heroImg, setHeroImg] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&fit=crop&q=80',
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % heroImages.length), 3800);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const featured4 = EXPANDED_FOOD_CATALOGUE.slice(0, 4);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#014C32] via-[#027040] to-[#079B48]" />
      <div className="absolute inset-0 opacity-15">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroImg ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#F28C00]/20 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[13px] font-semibold mb-6">
            <div className="w-2 h-2 rounded-full bg-[#F28C00] animate-pulse" />
            Now delivering across Lagos &amp; Abuja
          </div>

          <h1 className="text-[52px] sm:text-[64px] font-extrabold font-['Outfit'] leading-[1.05] tracking-tight mb-6">
            Fresh Meals,<br />
            <span className="text-[#F28C00]">Delivered Fast</span><br />
            with Smiles.
          </h1>

          <p className="text-[18px] text-white/80 mb-8 leading-relaxed max-w-lg">
            Order from hundreds of restaurants. Nigerian dishes, international cuisine, snacks, and cold drinks — delivered in minutes.
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full p-2 max-w-md mb-8">
            <div className="ml-2 shrink-0">
              <IconsaxIcon name="search" size={18} color="rgba(255,255,255,0.7)" />
            </div>
            <input
              type="text"
              placeholder="Search jollof rice, pizza, shawarma..."
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/60 text-[14px] font-medium outline-none min-w-0"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#F28C00] text-white text-[14px] font-bold hover:bg-[#D97700] transition-all shadow-md shrink-0"
            >
              Order Now
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-6 text-white/80">
            {[
              { icon: 'shop', val: '200+', label: 'Restaurants' },
              { icon: 'timer-1', val: '25 min', label: 'Avg Delivery' },
              { icon: 'star', val: '4.9', label: 'App Rating' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <IconsaxIcon name={b.icon} size={18} color="white" />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-white font-['Outfit']">{b.val}</p>
                  <p className="text-[12px] text-white/70">{b.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-4 relative">
          {featured4.map((dish, i) => (
            <Link
              key={dish.id}
              to="/login"
              className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] overflow-hidden hover:scale-[1.02] transition-transform duration-300 ${i === 1 ? 'mt-6' : i === 3 ? '-mt-6' : ''}`}
            >
              <img src={dish.image} alt={dish.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="text-[12px] font-semibold text-[#F28C00]">{dish.restaurant}</p>
                <p className="text-[14px] font-bold text-white leading-tight mt-0.5 line-clamp-1">{dish.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[15px] font-extrabold text-white font-['Outfit']">₦{(dish.price * 100).toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <IconsaxIcon name="star" size={12} color="#F28C00" />
                    <span className="text-[12px] text-white/70">{dish.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <div className="absolute -top-4 -right-4 bg-[#F28C00] text-white px-4 py-2 rounded-full text-[13px] font-extrabold shadow-xl rotate-6 select-none">
            Free Delivery!
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60H1440V30C1200 60 960 0 720 30C480 60 240 0 0 30V60Z" fill="#F5F6F5" className="dark:hidden" />
          <path d="M0 60H1440V30C1200 60 960 0 720 30C480 60 240 0 0 30V60Z" fill="#0F1311" className="hidden dark:block" />
        </svg>
      </div>
    </section>
  );
};

// ── Category Section ──────────────────────────────────────────────────────────
const CategorySection = () => {
  const categories = [
    { label: 'Nigerian Dishes', icon: 'recipe', color: '#079B48', bg: '#EAF8D8', count: 45 },
    { label: 'International', icon: 'global', color: '#F28C00', bg: '#FEF5E7', count: 38 },
    { label: 'Snacks & Bites', icon: 'cake', color: '#D95353', bg: '#FDECEC', count: 29 },
    { label: 'Drinks', icon: 'cup', color: '#087F3C', bg: '#D5F8E0', count: 22 },
    { label: 'Grills & Suya', icon: 'flame', color: '#b45309', bg: '#FFF3E0', count: 18 },
    { label: 'Soups', icon: 'pot', color: '#6B46C1', bg: '#F3E8FF', count: 16 },
  ];

  return (
    <section id="menu" className="py-20 bg-[#F5F6F5] dark:bg-[#0F1311]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#079B48]">Browse by Category</span>
          <h2 className="text-[36px] font-extrabold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2] mt-2 tracking-tight">
            What are you craving?
          </h2>
          <p className="text-[16px] text-[#777D79] dark:text-[#8E9A92] mt-3 max-w-2xl mx-auto">
            From hearty Nigerian staples to global street food — your favourite meals are just a tap away.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.label}
              to="/login"
              className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] hover:shadow-xl hover:scale-105 transition-all duration-300 group text-center"
            >
              <div
                className="w-14 h-14 rounded-[18px] flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: cat.bg }}
              >
                <IconsaxIcon name={cat.icon} size={28} color={cat.color} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] leading-tight">{cat.label}</p>
                <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">{cat.count}+ items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Featured Dishes Section ───────────────────────────────────────────────────
const FeaturedDishes = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', ...FOOD_CATEGORIES.filter(c => c !== 'All').slice(0, 3)];
  const featured = EXPANDED_FOOD_CATALOGUE
    .filter(d => activeFilter === 'All' || d.category === activeFilter)
    .slice(0, 6);

  return (
    <section className="py-20 bg-white dark:bg-[#181F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#079B48]">Top Picks</span>
            <h2 className="text-[34px] font-extrabold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2] mt-1 tracking-tight">
              Featured Dishes
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                  activeFilter === f
                    ? 'bg-[#079B48] text-white shadow-md'
                    : 'bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] dark:text-[#8E9A92] hover:text-[#079B48]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(dish => (
            <Link
              key={dish.id}
              to="/login"
              className="group block bg-[#F5F6F5] dark:bg-[#0F1311] border border-[#EEEEEE] dark:border-[#27332A] rounded-[26px] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-[#171917]">
                  {dish.prepTime}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                  <IconsaxIcon name="star" size={12} color="#F28C00" />
                  <span className="text-[11px] font-bold text-[#F28C00]">{dish.rating}</span>
                </div>
                <p className="absolute bottom-3 left-3 right-3 text-[16px] font-extrabold text-white font-['Outfit'] drop-shadow-sm line-clamp-1">
                  {dish.name}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[12px] font-semibold text-[#079B48] mb-1.5 flex items-center gap-1">
                  <IconsaxIcon name="shop" size={13} color="#079B48" />
                  {dish.restaurant}
                </p>
                <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92] line-clamp-2 mb-3">{dish.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[20px] font-black text-[#079B48] font-['Outfit']">₦{(dish.price * 100).toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#079B48]/10 text-[#079B48] text-[12px] font-bold">
                    <IconsaxIcon name="bag" size={14} color="#079B48" />
                    Add to Cart
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#079B48] text-white font-bold text-[15px] hover:bg-[#087F3C] shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore All {EXPANDED_FOOD_CATALOGUE.length}+ Dishes</span>
            <IconsaxIcon name="arrow-right" size={18} color="white" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── Restaurants Section ───────────────────────────────────────────────────────
const RestaurantsSection = () => {
  const restaurants = [
    { name: 'Mama Cass Restaurant', cuisine: 'Nigerian, Soups & Grills', rating: 4.9, deliveryTime: '20-30 min', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop&q=80', tag: 'Most Popular' },
    { name: 'Sweet Sensation Kitchen', cuisine: 'Nigerian, Fast Food', rating: 4.8, deliveryTime: '15-25 min', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&fit=crop&q=80', tag: 'Fast Delivery' },
    { name: 'Bukka Hut Grills', cuisine: 'Nigerian Buka, Grills', rating: 4.7, deliveryTime: '25-35 min', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&fit=crop&q=80', tag: 'New' },
    { name: 'Terra Kulture Lounge', cuisine: 'Nigerian, International', rating: 4.9, deliveryTime: '30-40 min', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&fit=crop&q=80', tag: 'Top Rated' },
  ];

  return (
    <section id="restaurants" className="py-20 bg-[#F5F6F5] dark:bg-[#0F1311]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#079B48]">Our Partners</span>
          <h2 className="text-[34px] font-extrabold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2] mt-2 tracking-tight">
            Featured Restaurants
          </h2>
          <p className="text-[16px] text-[#777D79] dark:text-[#8E9A92] mt-3">
            Handpicked restaurants delivering quality meals with every order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map(r => (
            <Link
              key={r.name}
              to="/login"
              className="group block bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[26px] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#079B48] text-white text-[11px] font-extrabold">
                  {r.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-[16px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">{r.name}</h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">{r.cuisine}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <IconsaxIcon name="star" size={14} color="#F28C00" />
                    <span className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">{r.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                    <IconsaxIcon name="timer-1" size={13} color="#079B48" />
                    <span>{r.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── How It Works ──────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const steps = [
    { icon: 'search', title: 'Browse & Discover', desc: 'Explore hundreds of restaurants and thousands of dishes. Search by name, category, or location.', color: '#079B48' },
    { icon: 'bag', title: 'Add to Cart', desc: 'Select your favourite meals, customize portions, and add them to your secure cart in one tap.', color: '#F28C00' },
    { icon: 'wallet', title: 'Pay Securely', desc: 'Complete your order using your wallet, card, or bank transfer. All payments are encrypted end-to-end.', color: '#087F3C' },
    { icon: 'scooter', title: 'Track & Receive', desc: 'Watch your delivery in real time. Our riders deliver fresh meals with a smile, guaranteed.', color: '#079B48' },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-[#181F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#079B48]">Simple Process</span>
          <h2 className="text-[36px] font-extrabold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2] mt-2 tracking-tight">
            How SMILE FOOD Works
          </h2>
          <p className="text-[16px] text-[#777D79] dark:text-[#8E9A92] mt-3 max-w-xl mx-auto">
            Getting your favourite meal delivered is easier than ever. Four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center group">
              <div
                className="relative mx-auto w-20 h-20 rounded-[22px] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${step.color}dd, ${step.color}88)` }}
              >
                <IconsaxIcon name={step.icon} size={32} color="white" />
                <span
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-[#181F1A] border-2 flex items-center justify-center text-[11px] font-extrabold"
                  style={{ borderColor: step.color, color: step.color }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="text-[18px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Benefits Section ──────────────────────────────────────────────────────────
const BenefitsSection = () => {
  const benefits = [
    { icon: 'flash', title: 'Lightning Fast Delivery', desc: "Average delivery time of 25 minutes. We don't keep you hungry.", color: '#F28C00' },
    { icon: 'shield-check', title: 'Secure Escrow Payments', desc: 'Your money is held in escrow and only released after successful delivery.', color: '#079B48' },
    { icon: 'location', title: 'Live Order Tracking', desc: 'Watch your rider in real time from kitchen to your doorstep.', color: '#087F3C' },
    { icon: 'refresh', title: 'Easy Refunds', desc: 'Not satisfied? We process refunds quickly. No questions asked.', color: '#D95353' },
    { icon: 'receipt', title: 'Transparent Pricing', desc: 'No hidden fees. See delivery charges, service fees, and totals upfront.', color: '#6B46C1' },
    { icon: 'notification', title: 'Real-Time Notifications', desc: 'Stay updated at every step — from order placement to delivery.', color: '#0891b2' },
  ];

  return (
    <section className="py-20 bg-[#F5F6F5] dark:bg-[#0F1311]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#079B48]">Why Choose Us</span>
          <h2 className="text-[34px] font-extrabold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2] mt-2 tracking-tight">
            More than just food delivery
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(b => (
            <div key={b.title} className="flex items-start gap-4 p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">
              <div
                className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: `${b.color}18` }}
              >
                <IconsaxIcon name={b.icon} size={24} color={b.color} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">{b.title}</h3>
                <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Stats Banner ──────────────────────────────────────────────────────────────
const StatsSection = () => (
  <section className="py-16 bg-[#079B48] relative overflow-hidden">
    <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/10 blur-[80px]" />
    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F28C00]/20 blur-[80px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
      {[
        { val: '200+', label: 'Partner Restaurants' },
        { val: '50K+', label: 'Happy Customers' },
        { val: '1M+', label: 'Orders Delivered' },
        { val: '4.9', label: 'Average Rating' },
      ].map(s => (
        <div key={s.label}>
          <p className="text-[44px] font-extrabold font-['Outfit'] leading-none">{s.val}</p>
          <p className="text-[14px] text-white/75 mt-2 font-semibold">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

// ── CTA Section ───────────────────────────────────────────────────────────────
const CTASection = () => (
  <section className="py-24 bg-white dark:bg-[#181F1A]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-[28px] bg-[#079B48] flex items-center justify-center mx-auto shadow-2xl">
          <IconsaxIcon name="brand-smile" size={44} color="white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F28C00] flex items-center justify-center">
          <IconsaxIcon name="flash" size={16} color="white" />
        </div>
      </div>
      <h2 className="text-[42px] font-extrabold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2] tracking-tight mb-4">
        Ready to order?<br />
        <span className="text-[#079B48]">Join SMILE FOOD today.</span>
      </h2>
      <p className="text-[17px] text-[#777D79] dark:text-[#8E9A92] mb-10 max-w-lg mx-auto">
        Sign up for free, explore thousands of dishes, and get your first delivery on us. Fresh meals, delivered fast with smiles.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/signup"
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#079B48] text-white text-[16px] font-extrabold hover:bg-[#087F3C] shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <IconsaxIcon name="user-add" size={20} color="white" />
          Create Free Account
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#EEEEEE] dark:border-[#27332A] text-[#171917] dark:text-[#F0F5F2] text-[16px] font-bold hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-all"
        >
          <IconsaxIcon name="login" size={20} />
          Sign In
        </Link>
      </div>
      <p className="mt-6 text-[13px] text-[#AAAAAA] dark:text-[#555D58]">
        No credit card required &bull; Free account forever &bull; Cancel anytime
      </p>
    </div>
  </section>
);

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer id="contact" className="bg-[#0F1311] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#079B48] flex items-center justify-center">
                <IconsaxIcon name="brand-smile" size={22} color="white" />
              </div>
              <span className="font-extrabold text-[20px] text-[#079B48] font-['Outfit']">SMILE FOOD</span>
            </div>
            <p className="text-[14px] text-white/60 leading-relaxed mb-5">
              Fresh Meals, Delivered Fast with Smiles. Nigeria's premium food delivery platform.
            </p>
            <div className="flex items-center gap-3">
              {['instagram', 'twitter-x', 'facebook'].map(s => (
                <div key={s} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#079B48] cursor-pointer transition-colors">
                  <IconsaxIcon name={s} size={16} color="white" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Explore Food', id: 'menu' },
                { label: 'Restaurants', id: 'restaurants' },
                { label: 'How It Works', id: 'how-it-works' },
              ].map(l => (
                <li key={l.label}>
                  <button onClick={() => scrollTo(l.id)} className="text-[14px] text-white/60 hover:text-[#079B48] transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-5">Account</h4>
            <ul className="space-y-3">
              {[
                { label: 'Log In', to: '/login' },
                { label: 'Sign Up Free', to: '/signup' },
                { label: 'Forgot Password', to: '/forgot-password' },
                { label: 'Become a Vendor', to: '/signup?role=vendor' },
                { label: 'Become a Rider', to: '/signup?role=rider' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[14px] text-white/60 hover:text-[#079B48] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-5">Contact Us</h4>
            <ul className="space-y-4">
              {[
                { icon: 'location', text: '14 Adeola Odeku St, VI, Lagos, Nigeria' },
                { icon: 'call', text: '+234 801 234 5678' },
                { icon: 'sms', text: 'support@smilefood.ng' },
                { icon: 'clock', text: '24/7 Customer Support' },
              ].map(c => (
                <li key={c.icon} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <IconsaxIcon name={c.icon} size={16} color="#079B48" />
                  </div>
                  <span className="text-[13px] text-white/60">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/40">&copy; 2026 SMILE FOOD. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(p => (
              <Link key={p} to="/login" className="text-[13px] text-white/40 hover:text-white/70 transition-colors">{p}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── Main Landing Page Component ───────────────────────────────────────────────
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] transition-colors">
      <PublicNavbar scrolled={scrolled} />
      <HeroSection />
      <CategorySection />
      <FeaturedDishes />
      <RestaurantsSection />
      <HowItWorks />
      <BenefitsSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
