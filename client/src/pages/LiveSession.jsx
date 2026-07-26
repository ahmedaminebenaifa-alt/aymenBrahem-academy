import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import toast, { Toaster } from 'react-hot-toast';
import { getLiveToken } from '../api/live.api.js';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext';

import LiveStage from '../components/live/LiveStage.jsx';
import AudioSidebar from '../components/live/AudioSideBar.jsx';
import ControlBar from '../components/live/ControlBar.jsx';

const LiveSession = () => {
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await getLiveToken();
        setToken(data.token);
        setServerUrl(data.url);
        setRoomName(data.roomName);
      } catch (err) {
        console.error('Failed to fetch live token:', err);
        setError('لا يوجد بث مباشر حالياً أو تعذر الاتصال بالخادم.');
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#111827';
    return () => {
      document.body.style.margin = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleDisconnected = useCallback(async () => {
    if (isAdmin) {
      try {
        await api.post('/live/end');
      } catch (err) {
        console.error('Failed to end live session in DB:', err?.response?.data || err?.message);
      }
    }
    toast('تمت مغادرة الجلسة', { icon: '👋' });
    navigate('/');
  }, [isAdmin, navigate]);

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">{error}</div>;
  }

  if (!token) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white animate-pulse">جاري الاتصال بالبث المباشر...</div>;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={serverUrl}
      connect={true}
      options={{
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: { simulcast: true },
      }}
      data-lk-theme="default"
      className="flex flex-col h-[100dvh] w-full bg-gray-900 text-white overflow-hidden"
      onDisconnected={handleDisconnected}
    >
      <Toaster position="top-center" toastOptions={{ className: 'bg-gray-800 text-white border border-gray-700' }} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-[2000px] mx-auto bg-black lg:bg-gray-900 relative">
        
        {/* Stage - Now takes full height on mobile */}
        <div className="flex-1 p-0 lg:p-4 flex items-center justify-center relative min-h-0 bg-black">
          <LiveStage />
        </div>

        {/* Mobile Overlay Background */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar - Drawer on Mobile, Fixed Column on Desktop */}
        <div 
          className={`absolute lg:relative w-full lg:w-80 h-[65vh] lg:h-full bottom-0 left-0 lg:bottom-auto lg:left-auto bg-gray-900 lg:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-800 shrink-0 flex flex-col z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none transition-transform duration-300 ease-in-out rounded-t-3xl lg:rounded-none ${
            isSidebarOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
          }`}
        >
          {/* Mobile drag handle indicator */}
          <div 
            className="w-full flex items-center justify-center pt-3 pb-2 lg:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
          </div>
          
          <AudioSidebar roomName={roomName} onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Fixed Control Bar at Bottom */}
      <div className="h-[72px] md:h-20 bg-gray-950 border-t border-gray-800 flex items-center justify-center shrink-0 z-50">
        <ControlBar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default LiveSession;