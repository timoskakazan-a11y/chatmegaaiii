import React, { useState } from 'react';

// --- CONFIG ---
const BOT_TOKEN = "8328506256:AAHdrm3QvgrB_HZ4K2z6l7C9O5R6r5-oX_Q";

// --- TYPES ---
interface UserProfile {
  id: string;
  telegram_id: number;
  username: string;
  first_name: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  telegram_id: number;
  message_text: string;
  reply_text?: string;
  status: 'pending' | 'replied' | 'rejected';
  created_at: string;
}

// --- ICONS ---
const Icons = {
  Chat: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Broadcast: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  Brain: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Link: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
};

const App: React.FC = () => {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Data
  const [activeTab, setActiveTab] = useState<'messages' | 'users' | 'broadcast'>('messages');
  // Mock data since DB is removed
  const [messages] = useState<ChatMessage[]>([]);
  const [users] = useState<UserProfile[]>([]);

  // Broadcast State
  const [broadcastId, setBroadcastId] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [isSendingCast, setIsSendingCast] = useState(false);

  // Setup State
  const [isSettingHook, setIsSettingHook] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2055') setIsAuthenticated(true);
    else alert('Access Denied');
  };

  const handleSetWebhook = async () => {
    setIsSettingHook(true);
    try {
      // Construct the webhook URL based on the current browser location
      // Netlify functions are always at /.netlify/functions/function_name
      const webhookUrl = `${window.location.origin}/.netlify/functions/webhook`;
      const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`;
      
      const res = await fetch(apiUrl);
      const data = await res.json();
      
      if (data.ok) {
        alert(`✅ Webhook set successfully!\nURL: ${webhookUrl}\n\nGo to Telegram and click /start.`);
      } else {
        alert(`❌ Error from Telegram: ${data.description}`);
      }
    } catch (e: any) {
      alert(`Network Error: ${e.message}`);
    }
    setIsSettingHook(false);
  };

  const sendBroadcast = async () => {
      if (!broadcastId || !broadcastMsg) return alert('Fill fields');
      setIsSendingCast(true);
      try {
          const res = await fetch('/.netlify/functions/publish', {
              method: 'POST',
              body: JSON.stringify({ target_chat_id: broadcastId, message: broadcastMsg })
          });
          const data = await res.json();
          if (data.success) {
            alert('Sent!');
            setBroadcastMsg('');
          } else {
            alert('Error: ' + data.error);
          }
      } catch(e) { alert('Error sending'); }
      setIsSendingCast(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-sm">
          <div className="flex justify-center mb-6 text-indigo-500">
             <div className="p-3 bg-indigo-500/10 rounded-xl"><Icons.Brain /></div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">MEGA AI <span className="text-indigo-500">Core</span></h1>
          <p className="text-slate-400 text-center mb-6 text-sm">System Access</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Passcode" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-center tracking-widest"
              value={passwordInput} onChange={e => setPasswordInput(e.target.value)}
            />
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
              Initialize
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 border-b md:border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg text-white"><Icons.Brain /></div>
             <div>
                 <h1 className="font-bold text-white tracking-wide">MEGA AI</h1>
                 <div className="text-[10px] text-indigo-400 font-mono">● STANDALONE</div>
             </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
            <NavBtn active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<Icons.Chat />} label="Live Dialogs" />
            <NavBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Icons.Users />} label="Users Database" />
            <NavBtn active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} icon={<Icons.Broadcast />} label="Broadcast" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
            <button 
                onClick={handleSetWebhook}
                disabled={isSettingHook}
                className="flex items-center gap-3 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 px-4 py-3 rounded-xl transition-colors text-sm font-medium w-full border border-emerald-600/20"
            >
               <Icons.Link /> 
               {isSettingHook ? 'Connecting...' : 'Connect Bot'}
            </button>

            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 px-4 py-2 transition-colors text-sm font-medium w-full">
                <Icons.LogOut /> Logout
            </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        <header className="mb-8">
            <h2 className="text-2xl font-bold text-white">{activeTab === 'messages' ? 'Live Dialogs' : activeTab === 'users' ? 'User Database' : 'Global Broadcast'}</h2>
            <p className="text-slate-500 text-sm mt-1">
                Database disconnected. Running in clean stateless mode.
            </p>
        </header>

        {activeTab === 'messages' && (
            <div className="space-y-4 max-w-4xl text-center py-10">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 inline-block text-slate-400">
                    No active database connection. <br/> Chat logs are transient.
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="text-center py-10 text-slate-500">
                User database is empty.
            </div>
        )}

        {activeTab === 'broadcast' && (
            <div className="max-w-2xl bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="mb-4">
                    <label className="block text-slate-400 text-sm font-bold mb-2">Target ID (Channel or User)</label>
                    <input 
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="@channel or 123456789"
                        value={broadcastId} onChange={e => setBroadcastId(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-400 text-sm font-bold mb-2">Message Content (HTML Supported)</label>
                    <textarea 
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32"
                        placeholder="System update..."
                        value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
                    />
                </div>
                <button onClick={sendBroadcast} disabled={isSendingCast} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    {isSendingCast ? 'Transmitting...' : 'Send Broadcast'}
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    {label}
  </button>
);

export default App;