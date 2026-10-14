import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { CONTACT_CHATS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const MessagesPage = () => {
  const { showToast } = useApp();
  const [chats, setChats] = useState(CONTACT_CHATS);
  const [activeChatId, setActiveChatId] = useState(CONTACT_CHATS[0].id);
  const [inputText, setInputText] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const quickReplies = [
    "Driver has arrived at vendor",
    "Food is packed and being checked",
    "Courier is 5 minutes away",
    "Escrow payout has settled"
  ];

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'mike',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: textToSend,
          lastTime: newMsg.time
        };
      }
      return chat;
    }));

    setInputText('');

    // Simulate response after 1.5 seconds
    setTimeout(() => {
      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: activeChat.role.toLowerCase().includes('rider') ? 'rider' : 'vendor',
        text: "Understood, Operations Lead. Proceeding as confirmed!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, replyMsg],
            lastMessage: replyMsg.text,
            lastTime: replyMsg.time
          };
        }
        return c;
      }));
      showToast(`New reply from ${activeChat.name}`, 'info');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/" label="Dashboard" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          Operations Dispatch Messages
        </h2>
        <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
          Real-time coordination channel with couriers, partner kitchens, and customers
        </p>
      </div>

      <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Column: Contact List (4 cols) */}
        <div className="md:col-span-4 border-r border-[#EEEEEE] dark:border-[#27332A] flex flex-col">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
            <div className="pill-search flex items-center px-3.5 py-2 gap-2 bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A]">
              <IconsaxIcon name="search" size={15} color="#777D79" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-transparent text-[12px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#EEEEEE]/60 dark:divide-[#27332A]/60">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-[#EAF8D8]/50 dark:bg-[#14301C]/60' 
                      : 'hover:bg-[#F5F6F5] dark:hover:bg-[#202922]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-11 h-11 rounded-full object-cover border border-white dark:border-[#181F1A]"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#149B57] ring-2 ring-white dark:ring-[#181F1A]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] truncate">
                        {chat.name}
                      </p>
                      <span className="text-[10px] text-[#777D79] dark:text-[#8E9A92] shrink-0">
                        {chat.lastTime}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-[#079B48] mb-0.5">
                      {chat.role} {chat.orderId ? `• ${chat.orderId}` : ''}
                    </p>

                    <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Stream & Message Input (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-[#F5F6F5]/40 dark:bg-[#181F1A]">
          {/* Chat Header */}
          <div className="p-4 px-6 border-b border-[#EEEEEE] dark:border-[#27332A] bg-white dark:bg-[#181F1A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2] leading-tight">
                  {activeChat.name}
                </p>
                <p className="text-[11px] font-semibold text-[#079B48] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#149B57]" />
                  {activeChat.role} • Linked to {activeChat.orderId}
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast(`Calling ${activeChat.name}...`, 'info')}
              className="px-3.5 py-1.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] text-[12px] font-bold text-[#777D79] hover:text-[#171917] dark:hover:text-white flex items-center gap-1.5"
            >
              <IconsaxIcon name="call" size={14} color="#079B48" />
              <span>Direct Call</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {activeChat.messages.map((msg) => {
              const isMike = msg.sender === 'mike';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMike ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed ${
                      isMike
                        ? 'bg-[#079B48] text-white rounded-br-xs shadow-sm shadow-[#079B48]/15'
                        : 'bg-white dark:bg-[#202922] text-[#171917] dark:text-[#F0F5F2] rounded-bl-xs border border-[#EEEEEE] dark:border-[#27332A]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#777D79] dark:text-[#8E9A92] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Pills */}
          <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto bg-white/70 dark:bg-[#181F1A]/70 border-t border-[#EEEEEE] dark:border-[#27332A]">
            <span className="text-[10px] font-bold uppercase text-[#777D79] shrink-0">Quick:</span>
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(reply)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F5F6F5] dark:bg-[#202922] text-[#171917] dark:text-[#F0F5F2] hover:bg-[#EAF8D8] hover:text-[#079B48] shrink-0 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-4 px-6 bg-white dark:bg-[#181F1A] border-t border-[#EEEEEE] dark:border-[#27332A]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your dispatch or operational message..."
                className="flex-1 p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center gap-1.5"
              >
                <span>Send</span>
                <IconsaxIcon name="mail" size={16} color="#FFFFFF" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
