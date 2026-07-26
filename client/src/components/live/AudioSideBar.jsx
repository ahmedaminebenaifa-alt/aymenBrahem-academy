import { useState } from 'react';
import { useParticipants } from '@livekit/components-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AudioSidebar = ({ roomName }) => {
  const participants = useParticipants();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 border-l border-gray-800 text-white">
      <div className="p-3 md:p-4 border-b border-gray-800 bg-gray-950 shrink-0">
        <h2 className="text-sm md:text-lg font-bold flex items-center justify-between">
          <span>المشاركون</span>
          <span className="bg-primary text-on-primary text-[10px] md:text-xs px-2 py-1 rounded-full font-mono">
            {participants.length}
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
        {participants.map((p) => (
          <ParticipantRow key={p.identity} participant={p} isAdmin={isAdmin} roomName={roomName} />
        ))}
      </div>
    </div>
  );
};

const ParticipantRow = ({ participant, isAdmin, roomName }) => {
  const [actionLoading, setActionLoading] = useState(null); // 'approve' | 'revoke' | 'kick' | null

  const isSpeaking = participant.isSpeaking;
  const isMicMuted = !participant.isMicrophoneEnabled;

  let metadata = {};
  try {
    metadata = JSON.parse(participant.metadata || '{}');
  } catch {
    metadata = {};
  }

  const hasHandRaised = metadata.handRaised === true;
  const canPublish = participant.permissions?.canPublish;
  const displayName = participant.name?.trim() || (isAdmin && participant.isLocal ? 'المعلم' : 'مستخدم');

  const runAction = async (action, endpoint) => {
    setActionLoading(action);
    try {
      await api.post(endpoint, { identity: participant.identity, roomName });
    } catch (err) {
      console.error(`Failed to ${action}`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = () => runAction('approve', '/live/approve-mic');
  const handleRevoke = () => runAction('revoke', '/live/revoke-mic');
  const handleKick = () => {
    if (!window.confirm(`هل تريد إخراج "${displayName}" من الجلسة؟`)) return;
    runAction('kick', '/live/kick');
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 p-2 md:p-3 rounded-xl transition-all duration-300 ${
        isSpeaking ? 'bg-primary/20 border border-primary shadow-[0_0_15px_rgba(134,175,153,0.3)]' : 'bg-gray-800 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-2 md:gap-3 overflow-hidden min-w-0">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs md:text-sm font-bold shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="truncate text-xs md:text-sm font-medium text-gray-200">
          {displayName}
          {participant.isLocal && ' (أنت)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {hasHandRaised && !canPublish && (
          <span className="material-symbols-outlined text-[18px] md:text-[20px] text-yellow-400 animate-bounce" title="يريد التحدث">
            front_hand
          </span>
        )}

        {isAdmin && !participant.isLocal && (
          <>
            {hasHandRaised && !canPublish && (
              <button
                onClick={handleApprove}
                disabled={actionLoading === 'approve'}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                title="السماح بالتحدث"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {actionLoading === 'approve' ? 'progress_activity' : 'check_circle'}
                </span>
              </button>
            )}

            {canPublish && (
              <button
                onClick={handleRevoke}
                disabled={actionLoading === 'revoke'}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                title="كتم الميكروفون"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {actionLoading === 'revoke' ? 'progress_activity' : 'mic_off'}
                </span>
              </button>
            )}

            <button
              onClick={handleKick}
              disabled={actionLoading === 'kick'}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors disabled:opacity-50"
              title="إخراج من الجلسة"
            >
              <span className="material-symbols-outlined text-[18px]">
                {actionLoading === 'kick' ? 'progress_activity' : 'person_remove'}
              </span>
            </button>
          </>
        )}

        {canPublish && (
          <span className={`material-symbols-outlined text-[18px] ${isMicMuted ? 'text-red-500' : isSpeaking ? 'text-primary animate-pulse' : 'text-green-500'}`}>
            {isMicMuted ? 'mic_off' : 'mic'}
          </span>
        )}
      </div>
    </div>
  );
};

export default AudioSidebar;