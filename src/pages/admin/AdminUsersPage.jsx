import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../context/AuthContext';

const INITIAL_USERS = [
  { id: 'usr-1', name: 'Adeola Williams', email: 'adeola@smilefood.com', role: ROLES.CUSTOMER, status: 'Active', balance: 320.00, joined: '2026-08-14', orders: 24 },
  { id: 'usr-2', name: 'Mama Cass Restaurant', email: 'mamacass@smilefood.com', role: ROLES.VENDOR, status: 'Active', balance: 4250.00, joined: '2026-06-01', orders: 312 },
  { id: 'usr-3', name: 'Tunde Bakare', email: 'tunde.rider@smilefood.com', role: ROLES.RIDER, status: 'Active', balance: 680.00, joined: '2026-07-20', orders: 184 },
  { id: 'usr-4', name: 'Mike Adeleke', email: 'admin@smilefood.com', role: ROLES.ADMIN, status: 'Active', balance: 1500.00, joined: '2026-01-10', orders: 0 },
  { id: 'usr-5', name: 'Sweet Sensation Kitchen', email: 'sweetsensation@smilefood.com', role: ROLES.VENDOR, status: 'Active', balance: 2890.00, joined: '2026-08-01', orders: 198 },
  { id: 'usr-6', name: 'Chukwuma Eze', email: 'chukwuma@smilefood.com', role: ROLES.CUSTOMER, status: 'Active', balance: 145.50, joined: '2026-09-12', orders: 9 },
  { id: 'usr-7', name: 'Emeka Nwosu', email: 'emeka.rider@smilefood.com', role: ROLES.RIDER, status: 'Suspended', balance: 50.00, joined: '2026-08-25', orders: 42 },
  { id: 'usr-8', name: 'Terra Kulture Lounge', email: 'terrakulture@smilefood.com', role: ROLES.VENDOR, status: 'Active', balance: 5120.00, joined: '2026-05-15', orders: 420 },
];

export const AdminUsersPage = () => {
  const { showToast } = useApp();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: ROLES.CUSTOMER, balance: 100 });

  const roleCounts = {
    ALL: users.length,
    [ROLES.ADMIN]: users.filter(u => u.role === ROLES.ADMIN).length,
    [ROLES.CUSTOMER]: users.filter(u => u.role === ROLES.CUSTOMER).length,
    [ROLES.VENDOR]: users.filter(u => u.role === ROLES.VENDOR).length,
    [ROLES.RIDER]: users.filter(u => u.role === ROLES.RIDER).length,
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User ${u.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id, name) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast(`Account for ${name} removed from platform`, 'info');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) {
      showToast('Please provide user name and email.', 'warning');
      return;
    }
    const created = {
      id: `usr-${Date.now()}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: 'Active',
      balance: parseFloat(newUserData.balance || 0),
      joined: new Date().toISOString().split('T')[0],
      orders: 0
    };
    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUserData({ name: '', email: '', role: ROLES.CUSTOMER, balance: 100 });
    showToast(`New ${created.role.toUpperCase()} account created successfully!`, 'success');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF8D8] text-[#079B48]">Admin</span>;
      case ROLES.VENDOR:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF6E5] text-[#F28C00]">Vendor</span>;
      case ROLES.RIDER:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F1FC] text-[#087F3C]">Rider</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F5F6F5] text-[#171917]">Customer</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/admin" label="Dashboard" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Account & Permission Management
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Supervise user access, role assignments, and account statuses across SMILE FOOD
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <IconsaxIcon name="add" size={16} color="white" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'All Users', count: roleCounts.ALL },
          { id: ROLES.ADMIN, label: 'Admins', count: roleCounts[ROLES.ADMIN] },
          { id: ROLES.CUSTOMER, label: 'Customers', count: roleCounts[ROLES.CUSTOMER] },
          { id: ROLES.VENDOR, label: 'Vendors', count: roleCounts[ROLES.VENDOR] },
          { id: ROLES.RIDER, label: 'Riders', count: roleCounts[ROLES.RIDER] },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-[13px] font-bold transition-all flex items-center gap-2 ${
              roleFilter === tab.id
                ? 'bg-[#079B48] text-white shadow-sm'
                : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] hover:bg-[#EAF8D8] hover:text-[#079B48] border border-[#EEEEEE] dark:border-[#27332A]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              roleFilter === tab.id ? 'bg-white/25 text-white' : 'bg-[#F5F6F5] dark:bg-[#202922]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="smile-card p-4 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl">
        <div className="flex items-center px-3 gap-2.5 bg-[#F5F6F5] dark:bg-[#202922] rounded-xl border border-[#EEEEEE] dark:border-[#27332A]">
          <IconsaxIcon name="search" size={16} color="#777D79" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts by name or email address..."
            className="w-full py-2.5 bg-transparent text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear Search" className="text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2]">
              <IconsaxIcon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EEEEEE] dark:border-[#27332A] bg-[#FAFAFA] dark:bg-[#141A16] text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
                <th className="py-4 px-6">User / Account</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Wallet Balance</th>
                <th className="py-4 px-6">Activity</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] dark:divide-[#27332A] text-[13px]">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#F5F6F5]/60 dark:hover:bg-[#202922]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EAF8D8] text-[#079B48] flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#171917] dark:text-[#F0F5F2] leading-tight">{user.name}</p>
                        <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      user.status === 'Active' 
                        ? 'bg-[#EAF8D8] text-[#079B48]' 
                        : 'bg-[#FDECEC] text-[#D95353]'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold font-['Outfit'] text-[#171917] dark:text-[#F0F5F2]">
                    ${user.balance.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-[#777D79] dark:text-[#8E9A92] text-[12px]">
                    {user.orders > 0 ? `${user.orders} orders` : 'Joined ' + user.joined}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        title={user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-[#EEEEEE] dark:border-[#27332A] hover:border-[#079B48] text-[#171917] dark:text-[#F0F5F2]"
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id, user.name)}
                        title="Delete User"
                        className="p-1.5 rounded-xl text-[#D95353] hover:bg-[#FDECEC] transition-colors"
                      >
                        <IconsaxIcon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <h3 className="text-[18px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Create System Account
              </h3>
              <button onClick={() => setShowAddModal(false)} aria-label="Close Modal" className="p-1 rounded-full text-[#777D79] hover:text-[#171917] dark:hover:text-white">
                <IconsaxIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Full Name / Business Name</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="e.g. Bukka Hut Restaurant"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="name@smilefood.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Assigned RBAC Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                >
                  <option value={ROLES.CUSTOMER}>Customer (Buyer)</option>
                  <option value={ROLES.VENDOR}>Vendor (Restaurant / Kitchen)</option>
                  <option value={ROLES.RIDER}>Rider (Courier Fleet)</option>
                  <option value={ROLES.ADMIN}>Admin (Operations Supervisor)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Initial Escrow / Wallet Balance ($)</label>
                <input
                  type="number"
                  value={newUserData.balance}
                  onChange={(e) => setNewUserData({ ...newUserData, balance: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
