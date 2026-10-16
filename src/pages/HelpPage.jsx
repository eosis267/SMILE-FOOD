import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import { FAQS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const HelpPage = () => {
  const { showToast } = useApp();
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('NORMAL');

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast('Please fill in ticket subject and message.', 'warning');
      return;
    }
    showToast(`Support Ticket #${Math.floor(1000 + Math.random()*9000)} dispatched to operations engineering!`, 'success');
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-7 max-w-4xl animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/" label="Dashboard" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          Operations Help Center & Knowledge Base
        </h2>
        <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
          Documentation for food dispatch, ACID escrow transactions, and emergency escalations
        </p>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#079B48] to-[#087F3C] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-[#079B48]/15">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D5F28A] block mb-1">
            24/7 Operations Hotline
          </span>
          <h3 className="text-[18px] font-bold">
            Live Escalations Desk for Dispatch & Fleet
          </h3>
          <p className="text-[12px] text-white/80 mt-0.5">
            Average response time under 90 seconds for priority driver issues.
          </p>
        </div>

        <button
          onClick={() => showToast('Connecting to Priority Dispatch Desk...', 'info')}
          className="px-5 py-2.5 rounded-full bg-white text-[#079B48] font-bold text-[13px] hover:bg-[#EAF8D8] transition-all shrink-0"
        >
          Call Desk (+1-800-SMILE-OPS)
        </button>
      </div>

      {/* FAQs Accordion */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
        <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-4">
          Frequently Answered Questions
        </h3>

        <div className="divide-y divide-[#EEEEEE] dark:divide-[#27332A]">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4 group"
                >
                  <span className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2] group-hover:text-[#079B48] transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-[#079B48] text-lg font-bold">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92] mt-2.5 leading-relaxed pl-1 animate-in fade-in duration-100">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Ticket Submission Form */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
        <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-1">
          Submit Operations Support Ticket
        </h3>
        <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mb-5">
          Report technical gateway discrepancies, escrow dispute claims, or rider routing glitches
        </p>

        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-[#777D79] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Escrow auto-release delay on order #SF-89240"
                className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#777D79] mb-1">
                Priority Level
              </label>
              <select
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
              >
                <option value="LOW">Low (Inquiry)</option>
                <option value="NORMAL">Normal (Standard)</option>
                <option value="CRITICAL">Critical (Immediate Escalation)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#777D79] mb-1">
              Description & Evidence
            </label>
            <textarea
              rows={4}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Provide order identifiers, courier logs, or error stack traces..."
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpPage;
