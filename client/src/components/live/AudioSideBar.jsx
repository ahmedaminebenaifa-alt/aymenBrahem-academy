import { useParticipants } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useAuth } from '../../context/AuthContext'; // 👈 Adjust path if needed

const AudioSidebar = () => {
  // 1. Get an array of EVERYONE in the live room (Admin + 50 Students)
  const participants = useParticipants();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 text-white">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800 bg-gray-950">
        <h2 className="text-lg font-bold flex items-center justify-between">
          <span>المشاركون</span>
          <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
            {participants.length}
          </span>
        </h2>
      </div>

      {/* PARTICIPANTS LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {participants.map((participant) => (
          <ParticipantRow 
            key={participant.identity} 
            participant={participant} 
            isAdmin={isAdmin} 
          />
        ))}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT FOR EACH ROW ---
const ParticipantRow = ({ participant, isAdmin }) => {
  // LiveKit automatically tracks these states in real-time!
  const isSpeaking = participant.isSpeaking;
  const isMicMuted = !participant.isMicrophoneEnabled;

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
        isSpeaking 
          ? 'bg-blue-900/40 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'bg-gray-800 border border-transparent'
      }`}
    >
      {/* NAME & AVATAR INFO */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {participant.name ? participant.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="truncate text-sm font-medium text-gray-200">
          {participant.name || 'مستخدم غير معروف'}
          {participant.isLocal && ' (أنت)'}
        </span>
      </div>

      {/* MIC STATUS / ADMIN CONTROLS */}
      <div className="flex items-center gap-2 flex-shrink-0">
        
        {/* Speaking Animation vs Muted Icon */}
        {isMicMuted ? (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7.022 7.022 0 01-3 5.308m-3.92 5.692A7.001 7.001 0 0112 21a7 7 0 01-7-7m7 7v-4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
          </svg>
        ) : isSpeaking ? (
          <div className="flex space-x-1 space-x-reverse items-center h-4">
            <div className="w-1 h-3 bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-4 bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-2 bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7.022 7.022 0 01-3 5.308A7.001 7.001 0 0112 21a7 7 0 01-7-7m7 7v-4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}

      </div>
    </div>
  );
};

export default AudioSidebar;