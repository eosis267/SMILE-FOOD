import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';
import { EXPANDED_FOOD_CATALOGUE, FOOD_CATEGORIES } from '../../data/foodCatalogue';

// Bootstrap vendor menu from the first 8 items in the expanded catalogue
const INITIAL_VENDOR_MENU = EXPANDED_FOOD_CATALOGUE.slice(0, 8).map(item => ({
  id: `vm-${item.id}`,
  name: item.name,
  price: item.price,
  category: item.category,
  status: 'Available',
  orders: Math.floor(Math.random() * 200 + 10),
  image: item.image,
  description: item.description,
}));


export const VendorMenuPage = () => {
  const { showToast } = useApp();
  const [menu, setMenu] = useState(INITIAL_VENDOR_MENU);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: FOOD_CATEGORIES[1] || 'Nigerian Dishes', description: '', image: '' });

  const toggleStock = (id) => {
    setMenu(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Available' ? 'Out of Stock' : 'Available';
        showToast(`${item.name} is now marked ${nextStatus}`, nextStatus === 'Available' ? 'success' : 'warning');
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const deleteItem = (id, name) => {
    setMenu(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${name}" from restaurant menu`, 'info');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      showToast('Please fill in dish name and price.', 'warning');
      return;
    }
    const created = {
      id: `vm-${Date.now()}`,
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      status: 'Available',
      orders: 0,
      image: newItem.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&fit=crop&q=80',
      description: newItem.description || 'Delicious kitchen special.'
    };
    setMenu([created, ...menu]);
    setShowAddModal(false);
    setNewItem({ name: '', price: '', category: FOOD_CATEGORIES[1] || 'Nigerian Dishes', description: '', image: '' });
    showToast(`Dish "${created.name}" added to menu!`, 'success');
  };

  const filtered = menu.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/vendor" label="Kitchen Overview" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Menu Management & Stock Control
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Upload dishes, update prices, and toggle live availability for customer orders
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold shadow-md shadow-[#079B48]/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <IconsaxIcon name="add" size={16} color="white" />
          <span>Upload New Dish</span>
        </button>
      </div>

      {/* Search & Stock Filter */}
      <div className="smile-card p-4 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl flex items-center gap-3">
        <IconsaxIcon name="search" size={18} color="#777D79" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter menu dishes by title..."
          className="w-full bg-transparent text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
        />
      </div>

      {/* Menu Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div
            key={item.id}
            className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[30px] overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-xs ${
                  item.status === 'Available' ? 'bg-[#EAF8D8] text-[#079B48]' : 'bg-[#FDECEC] text-[#D95353]'
                }`}>
                  {item.status}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white font-mono font-bold text-xs">
                  {item.orders} Sold
                </div>
              </div>

              <div className="p-5">
                <span className="text-[11px] font-bold uppercase text-[#079B48]">{item.category}</span>
                <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] mt-0.5">{item.name}</h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-[#EEEEEE] dark:border-[#27332A] mt-2">
              <span className="text-[20px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                ₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStock(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                    item.status === 'Available'
                      ? 'border-[#D95353] text-[#D95353] hover:bg-[#FDECEC]'
                      : 'border-[#079B48] text-[#079B48] hover:bg-[#EAF8D8]'
                  }`}
                >
                  {item.status === 'Available' ? 'Mark Out of Stock' : 'Mark Available'}
                </button>
                <button
                  onClick={() => deleteItem(item.id, item.name)}
                  className="p-1.5 text-[#D95353] hover:bg-[#FDECEC] rounded-xl transition-colors"
                >
                  <IconsaxIcon name="trash" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <h3 className="text-[18px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Upload New Menu Dish
              </h3>
              <button onClick={() => setShowAddModal(false)} aria-label="Close Modal" className="p-1 rounded-full text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2]">
                <IconsaxIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Asun Fried Rice with Goat Meat"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Price (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="15.00"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                  >
                    {/* Dynamically render all catalogue categories */}
                    {FOOD_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Image URL</label>
                <input
                  type="url"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Appetizing description of ingredients and spices..."
                  className="w-full p-3 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#777D79]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold shadow-sm"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMenuPage;
