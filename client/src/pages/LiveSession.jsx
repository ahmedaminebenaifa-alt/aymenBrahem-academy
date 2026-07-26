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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-[2000px] mx-auto bg-black lg:bg-gray-900">
        
        {/* Stage - Edge to edge on mobile, padded on desktop */}
        <div className="flex-1 p-0 lg:p-4 flex items-center justify-center relative min-h-0 bg-black">
          <LiveStage />
        </div>
        
        {/* Sidebar - Fixed 40% height on mobile, fixed width on desktop */}
        <div className="w-full lg:w-80 h-[40vh] lg:h-full bg-gray-900 lg:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-800 shrink-0 flex flex-col z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
          <AudioSidebar roomName={roomName} />
        </div>
      </div>

      {/* Fixed Control Bar at Bottom */}
      <div className="h-[72px] md:h-20 bg-gray-950 border-t border-gray-800 flex items-center justify-center shrink-0 z-20">
        <ControlBar />
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default LiveSession;