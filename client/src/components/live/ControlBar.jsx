import { TrackToggle, DisconnectButton } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useAuth } from '../../context/AuthContext';

const ControlBar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <TrackToggle
          source={Track.Source.Microphone}
          showIcon={true}
          className="lk-button !bg-gray-800 hover:!bg-gray-700 !text-white !p-4 !rounded-full !transition-all"
        />
        <span className="text-xs text-gray-400">المايك</span>
      </div>

      {isAdmin && (
        <div className="flex flex-col items-center gap-1">
          <TrackToggle
            source={Track.Source.ScreenShare}
            showIcon={true}
            className="lk-button !bg-blue-600 hover:!bg-blue-500 !text-white !p-4 !rounded-full !transition-all shadow-lg shadow-blue-500/30"
          />
          <span className="text-xs text-gray-400">مشاركة الشاشة</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-1 ml-8">
        <DisconnectButton className="lk-button !bg-red-600 hover:!bg-red-500 !text-white !px-6 !py-3 !rounded-full font-bold !transition-all shadow-lg shadow-red-500/30">
          مغادرة البث
        </DisconnectButton>
      </div>
    </div>
  );
};

export default ControlBar;