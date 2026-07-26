import { useState, useEffect } from 'react';
import { DisconnectButton, useLocalParticipant } from '@livekit/components-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const ControlBar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { localParticipant, isMicrophoneEnabled, isScreenShareEnabled } = useLocalParticipant();
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [micBusy, setMicBusy] = useState(false);

  const canPublish = localParticipant?.permissions?.canPublish;

  useEffect(() => {
    if (canPublish && isHandRaised) {
      toast.success("تم منحك صلاحية التحدث!", { icon: '🎤' });
      setIsHandRaised(false);
    }
  }, [canPublish, isHandRaised]);

  const toggleMic = async () => {
    if (!canPublish || micBusy) return;
    setMicBusy(true);
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch (err) {
      console.error('Failed to toggle microphone', err);
      toast.error("حدث خطأ في الميكروفون.");
    } finally {
      setMicBusy(false);
    }
  };

  const toggleScreenShare = async () => {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (err) {
      console.error('Failed to toggle screen share', err);
      toast.error("فشلت مشاركة الشاشة.");
    }
  };

  const handleRaiseHand = async () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    try {
      await api.post('/live/raise-hand', { isRaised: next });
      if (next) toast.success('تم رفع اليد، في انتظار موافقة المعلم.');
    } catch (error) {
      console.error('Failed to raise hand', error);
      toast.error('حدث خطأ أثناء محاولة رفع اليد.');
      setIsHandRaised(!next);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 w-full px-2 md:px-4">
      {/* Mic Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={toggleMic}
          disabled={!canPublish || micBusy}
          className={`p-3 md:p-4 rounded-full transition-all flex items-center justify-center ${
            !canPublish
              ? 'bg-gray-800 text-gray-500 opacity-40 cursor-not-allowed'
              : isMicrophoneEnabled
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] md:text-[22px]">
            {micBusy ? 'progress_activity' : isMicrophoneEnabled ? 'mic' : 'mic_off'}
          </span>
        </button>
        <span className="text-[10px] md:text-xs text-gray-400">
          {!canPublish ? 'مغلق' : isMicrophoneEnabled ? 'كتم' : 'إلغاء الكتم'}
        </span>
      </div>

      {/* Screen Share (Admin Only) */}
      {isAdmin && (
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={toggleScreenShare}
            className={`p-3 md:p-4 rounded-full transition-all shadow-lg flex items-center justify-center ${
              isScreenShareEnabled ? 'bg-red-600 hover:bg-red-500' : 'bg-primary hover:opacity-90'
            } text-white`}
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">
              {isScreenShareEnabled ? 'stop_screen_share' : 'screen_share'}
            </span>
          </button>
          <span className="text-[10px] md:text-xs text-gray-400">
            {isScreenShareEnabled ? 'إيقاف المشاركة' : 'مشاركة الشاشة'}
          </span>
        </div>
      )}

      {/* Raise Hand (Student Only) */}
      {!isAdmin && !canPublish && (
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleRaiseHand}
            className={`p-3 md:p-4 rounded-full transition-all shadow-lg flex items-center justify-center ${
              isHandRaised ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">front_hand</span>
          </button>
          <span className="text-[10px] md:text-xs text-gray-400">
            {isHandRaised ? 'تم الرفع' : 'طلب تحدث'}
          </span>
        </div>
      )}

      {/* Disconnect */}
      <div className="flex flex-col items-center gap-1 mr-auto md:mr-0 md:ml-8">
        <DisconnectButton className="lk-button !bg-red-600 hover:!bg-red-500 !text-white !px-4 md:!px-6 !py-2 md:!py-3 !rounded-full text-sm md:text-base font-bold !transition-all shadow-lg flex items-center gap-2">
          مغادرة
        </DisconnectButton>
      </div>
    </div>
  );
};

export default ControlBar;