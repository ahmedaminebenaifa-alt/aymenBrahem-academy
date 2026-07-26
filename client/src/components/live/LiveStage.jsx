import { useState } from 'react';
import { useTracks, VideoTrack } from '@livekit/components-react';
import { Track, VideoQuality } from 'livekit-client';
import { usePinchZoom } from '../../hooks/usePinchZoom';

const QUALITY_OPTIONS = [
  { label: 'تلقائي', value: null },
  { label: 'عالية', value: VideoQuality.HIGH },
  { label: 'متوسطة', value: VideoQuality.MEDIUM },
  { label: 'منخفضة', value: VideoQuality.LOW },
];

const LiveStage = () => {
  const screenShareTracks = useTracks([Track.Source.ScreenShare]);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const zoom = usePinchZoom();

  const track = screenShareTracks[0];

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    setQualityMenuOpen(false);
    if (track?.publication?.setVideoQuality) {
      // null = let LiveKit's adaptive streaming decide automatically
      track.publication.setVideoQuality(quality ?? VideoQuality.HIGH);
    }
  };

  if (track) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-2xl relative touch-none">
        <div
          className="w-full h-full flex items-center justify-center"
          {...zoom.handlers}
          onDoubleClick={zoom.reset}
        >
          <div style={zoom.style} className="w-full h-full">
            <VideoTrack trackRef={track} className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-red-600 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 animate-pulse pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          مباشر
        </div>

        {zoom.scale > 1 && (
          <button
            onClick={zoom.reset}
            className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-gray-900/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">zoom_out</span>
            إعادة الضبط
          </button>
        )}

        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
          <button
            onClick={() => setQualityMenuOpen((v) => !v)}
            className="bg-gray-900/80 hover:bg-gray-900 text-white text-xs md:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">hd</span>
            {QUALITY_OPTIONS.find((q) => q.value === selectedQuality)?.label || 'تلقائي'}
          </button>

          {qualityMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl min-w-[120px]">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleQualityChange(opt.value)}
                  className={`w-full text-right px-4 py-2 text-xs md:text-sm transition-colors ${
                    selectedQuality === opt.value ? 'bg-primary text-on-primary' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 px-4 text-center">
      <span className="material-symbols-outlined text-5xl md:text-6xl text-gray-500 mb-4 animate-pulse">
        cast
      </span>
      <h2 className="text-lg md:text-2xl text-gray-400 font-semibold mb-2">الشاشة غير مفعلة حالياً</h2>
      <p className="text-gray-500 text-sm md:text-lg">في انتظار قيام المعلم ببدء البث...</p>
    </div>
  );
};

export default LiveStage;