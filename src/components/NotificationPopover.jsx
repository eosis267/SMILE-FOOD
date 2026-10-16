import React, { useRef, useEffect } from 'react';
import IconsaxIcon from './IconsaxIcon';
import { useApp } from '../context/AppContext';

export const NotificationPopover = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={popoverRef}
      className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#27332A]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[15px] text-[#171917] dark:text-[#F0F5F2]">
            Notifications
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF8D8] text-[#079B48] dark:bg-[#1C3322] dark:text-[#D5F28A]">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-[12px] font-semibold text-[#079B48] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[340px] overflow-y-auto divide-y divide-[#EEEEEE]/60 dark:divide-[#27332A]/60 py-1">
        {notifications.length === 0 ? (
          <p className="text-center text-[13px] text-[#777D79] py-8">
            No notifications at the moment
          </p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`py-3 px-2 rounded-xl cursor-pointer transition-colors ${
                notif.read ? 'opacity-70 hover:bg-[#F5F6F5] dark:hover:bg-[#202922]' : 'bg-[#EAF8D8]/30 dark:bg-[#14301C]/40 hover:bg-[#EAF8D8]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                  notif.type === 'order' ? 'bg-[#EAF8D8] text-[#079B48]' : notif.type === 'payment' ? 'bg-[#D5F28A]/50 text-[#087F3C]' : 'bg-gray-100 text-gray-700'
                }`}>
                  <IconsaxIcon name={notif.type === 'order' ? 'package' : notif.type === 'payment' ? 'wallet' : 'bell'} size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] leading-tight">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-[#777D79] dark:text-[#8E9A92]">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5 leading-snug">
                    {notif.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-[#EEEEEE] dark:border-[#27332A] text-center">
        <span className="text-[11px] font-medium text-[#777D79] dark:text-[#8E9A92]">
          Real-time webhook and event alerts
        </span>
      </div>
    </div>
  );
};

export default NotificationPopover;
