import { useParticipants } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios'; 

const AudioSidebar = () => {
  const participants = useParticipants();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 border-l border-gray-800 text-white">
      <div className="p-3 md:p-4 border-b border-gray-800 bg-gray-950 flex-shrink-0">
        <h2 className="text-sm md:text-lg font-bold flex items-center justify-between">
          <span>المشاركون</span>
          <span className="bg-blue-600 text-[10px] md:text-xs px-2 py-1 rounded-full">
            {participants.length}
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 custom-scrollbar">
        {participants.map((p) => (
          <ParticipantRow key={p.identity} participant={p} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
};

const ParticipantRow = ({ participant, isAdmin }) => {
  const isSpeaking = participant.isSpeaking;
  const isMicMuted = !participant.isMicrophoneEnabled;
  
  // 1. Read metadata safely (Backend updates this when student raises hand)
  let metadata = {};
  try { metadata = JSON.parse(participant.metadata || '{}'); } catch (e) {}
  
  const hasHandRaised = metadata.handRaised === true;
  const canPublish = participant.permissions?.canPublish;

  // 2. Admin approves student mic
  const handleApprove = async () => {
    try {
      await api.post('/live/approve-mic', { 
        identity: participant.identity, 
        roomName: 'YOUR_ROOM_NAME' // Passed from context or parent
      });
    } catch (error) {
      console.error("Failed to approve mic", error);
    }
  };

  return (
    <div className={`flex items-center justify-between p-2 md:p-3 rounded-xl transition-all duration-300 ${
      isSpeaking ? 'bg-blue-900/40 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gray-800 border border-transparent'
    }`}>
      <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
          {participant.name ? participant.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="truncate text-xs md:text-sm font-medium text-gray-200">
          {participant.name || 'طالب'}
          {participant.isLocal && ' (أنت)'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        
        {/* INDICATOR: Student wants to speak */}
        {hasHandRaised && !canPublish && (
          <span className="text-sm md:text-lg animate-bounce" title="يريد التحدث">✋</span>
        )}

        {/* ADMIN ACTION: Approve Button */}
        {isAdmin && hasHandRaised && !canPublish && !participant.isLocal && (
          <button 
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-500 text-white p-1 md:p-1.5 rounded-lg transition-colors shadow-lg"
            title="السماح بالتحدث"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        )}

        {/* MIC STATUS (Only visible if they have publish permissions) */}
        {canPublish ? (
          isMicMuted ? (
             <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7.022 7.022 0 01-3 5.308m-3.92 5.692A7.001 7.001 0 0112 21a7 7 0 01-7-7m7 7v-4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
            </svg>
          ) : isSpeaking ? (
             <div className="flex space-x-0.5 space-x-reverse items-center h-3 md:h-4">
              <div className="w-1 h-2 md:h-3 bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-3 md:h-4 bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1.5 md:h-2 bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7.022 7.022 0 01-3 5.308A7.001 7.001 0 0112 21a7 7 0 01-7-7m7 7v-4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )
        ) : null}
      </div>
    </div>
  );
};

export default AudioSidebar;