import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { getLiveToken } from '../api/live.api.js';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext';

import LiveStage from '../components/live/LiveStage.jsx';
import AudioSidebar from '../components/live/AudioSideBar.jsx';
import ControlBar from '../components/live/ControlBar.jsx';

const LiveSession = () => {
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
      } catch (err) {
        console.error('Failed to fetch live token:', err);
        setError('لا يوجد بث مباشر حالياً أو تعذر الاتصال بالخادم.');
      }
    };
    fetchToken();
  }, []);

  // Fires on ANY disconnect: button click, tab close, network drop — not just the leave button
  const handleDisconnected = useCallback(async () => {
    if (isAdmin) {
      try {
        await api.post('/live/end');
      } catch (err) {
        console.error('Failed to end live session in DB:', err.response?.data || err.message);
      }
    }
    navigate('/');
  }, [isAdmin, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        {error}
      </div>
    );
  }

  if (token === '') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        جاري الاتصال بالبث المباشر...
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      className="flex flex-col h-screen w-full bg-gray-900 text-white"
      onDisconnected={handleDisconnected}
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 flex items-center justify-center relative">
          <LiveStage />
        </div>
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <AudioSidebar />
        </div>
      </div>

      <div className="h-20 bg-gray-950 border-t border-gray-800 flex items-center justify-center">
        <ControlBar />
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default LiveSession;