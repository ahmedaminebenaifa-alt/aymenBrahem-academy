import { useState } from 'react';
import { TrackToggle, DisconnectButton, useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const ControlBar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  // 1. Get local participant to check dynamic permissions
  const { localParticipant } = useLocalParticipant();
  const [isHandRaised, setIsHandRaised] = useState(false);

  // LiveKit automatically updates this if the backend changes permissions
  const canPublish = localParticipant?.permissions?.canPublish;

  const handleRaiseHand = async () => {
    try {
      setIsHandRaised(!isHandRaised);
      // Send API request to update metadata so admin sees the ✋ icon
      await api.post('/live/raise-hand', { isRaised: !isHandRaised });
    } catch (error) {
      console.error("Failed to raise hand", error);
      setIsHandRaised(!isHandRaised); // Revert on failure
    }
  };

  return (
    // RESPONSIVE: flex-wrap and adjusted gaps/padding for mobile
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 w-full px-2 md:px-4">
      
      {/* MIC TOGGLE - Only works if Admin or Approved Student */}
      <div className="flex flex-col items-center gap-1">
        <div className={!canPublish ? 'opacity-40 pointer-events-none' : ''}>
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={true}
            className="lk-button !bg-gray-800 hover:!bg-gray-700 !text-white !p-3 md:!p-4 !rounded-full !transition-all"
          />
        </div>
        <span className="text-[10px] md:text-xs text-gray-400">
          {!canPublish ? 'مغلق' : 'المايك'}
        </span>
      </div>

      {/* SCREEN SHARE - Admin Only */}
      {isAdmin && (
        <div className="flex flex-col items-center gap-1">
          <TrackToggle
            source={Track.Source.ScreenShare}
            showIcon={true}
            className="lk-button !bg-blue-600 hover:!bg-blue-500 !text-white !p-3 md:!p-4 !rounded-full !transition-all shadow-lg shadow-blue-500/30"
          />
          <span className="text-[10px] md:text-xs text-gray-400">مشاركة الشاشة</span>
        </div>
      )}

      {/* RAISE HAND - Student Only (hidden if they already have mic access) */}
      {!isAdmin && !canPublish && (
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={handleRaiseHand}
            className={`!p-3 md:!p-4 !rounded-full !transition-all shadow-lg flex items-center justify-center ${
              isHandRaised 
                ? '!bg-yellow-500 hover:!bg-yellow-400 !text-gray-900 shadow-yellow-500/30' 
                : '!bg-gray-800 hover:!bg-gray-700 !text-white'
            }`}
          >
            <span className="text-lg md:text-xl leading-none">✋</span>
          </button>
          <span className="text-[10px] md:text-xs text-gray-400">
            {isHandRaised ? 'تم الرفع' : 'طلب تحدث'}
          </span>
        </div>
      )}

      {/* DISCONNECT */}
      <div className="flex flex-col items-center gap-1 mr-auto md:mr-0 md:ml-8">
        <DisconnectButton className="lk-button !bg-red-600 hover:!bg-red-500 !text-white !px-4 md:!px-6 !py-2 md:!py-3 !rounded-full text-sm md:text-base font-bold !transition-all shadow-lg shadow-red-500/30">
          مغادرة
        </DisconnectButton>
      </div>
    </div>
  );
};

export default ControlBar;