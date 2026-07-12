import { useTracks, VideoTrack } from '@livekit/components-react';
import { Track } from 'livekit-client';

const LiveStage = () => {
  // 1. LiveKit automatically searches the room for any active screen share tracks
  const screenShareTracks = useTracks([Track.Source.ScreenShare]);

  // 2. If someone (the Admin) is sharing their screen, render it
  if (screenShareTracks.length > 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* LiveKit's native component handles all the complex video decoding */}
        <VideoTrack
          trackRef={screenShareTracks[0]}
          className="w-full h-full object-contain" // object-contain ensures the screen isn't stretched
        />
        
        {/* A nice little UI badge so students know it's live */}
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          البث مباشر (LIVE)
        </div>
      </div>
    );
  }

  // 3. If no one is sharing a screen yet, show a nice placeholder
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl border-2 border-dashed border-gray-600">
      
      {/* Icon: A monitor with a slash or waiting symbol */}
      <svg className="w-16 h-16 text-gray-500 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
      
      <h2 className="text-2xl text-gray-400 font-semibold mb-2">الشاشة غير مفعلة حالياً</h2>
      <p className="text-gray-500 text-lg">في انتظار قيام مدير النظام ببدء البث...</p>
    </div>
  );
};

export default LiveStage;