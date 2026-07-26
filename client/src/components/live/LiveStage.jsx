import { useState, useRef, useEffect } from 'react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef(null);
  const zoom = usePinchZoom();
  const track = screenShareTracks[0];

  // Listen for native escape key or system back gesture exiting fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If the user exits fullscreen (e.g., via Android back button or swipe gesture),
      // we must release the landscape orientation lock.
      if (!isCurrentlyFullscreen && window.screen.orientation?.unlock) {
        window.screen.orientation.unlock();
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    setQualityMenuOpen(false);
    if (track?.publication?.setVideoQuality) {
      track.publication.setVideoQuality(quality ?? VideoQuality.HIGH);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        // 1. Enter Fullscreen
        await containerRef.current.requestFullscreen();
        
        // 2. Force Landscape Orientation (Paysage)
        if (window.screen.orientation?.lock) {
          try {
            await window.screen.orientation.lock('landscape');
          } catch (orientationError) {
            console.warn("Device does not support forcing orientation lock:", orientationError);
          }
        }
      } else {
        // 1. Exit Fullscreen
        await document.exitFullscreen();
        
        // 2. Release Orientation Lock (Revert to Portrait if held that way)
        if (window.screen.orientation?.unlock) {
          window.screen.orientation.unlock();
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  if (track) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-black lg:rounded-xl overflow-hidden shadow-2xl relative touch-none group"
      >
        <div
          className="w-full h-full flex items-center justify-center"
          {...zoom.handlers}
          onDoubleClick={zoom.reset}
        >
          <div style={zoom.style} className="w-full h-full">
            <VideoTrack trackRef={track} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Live Indicator */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-red-600 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 animate-pulse pointer-events-none z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          مباشر
        </div>

        {/* Zoom Reset Button */}
        {zoom.scale > 1 && (
          <button
            onClick={zoom.reset}
            className="absolute top-3 left-3 md:top-4 md:left-4 bg-gray-900/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 shadow-lg backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[16px]">zoom_out</span>
            إعادة الضبط
          </button>
        )}

        {/* Bottom Controls Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />

        {/* Bottom Controls Container */}
        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 flex items-center justify-between z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Quality Selector */}
          <div className="relative">
            <button
              onClick={() => setQualityMenuOpen((v) => !v)}
              className="bg-gray-900/90 hover:bg-black text-white text-xs md:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors backdrop-blur-sm border border-gray-700"
            >
              <span className="material-symbols-outlined text-[16px]">hd</span>
              {QUALITY_OPTIONS.find((q) => q.value === selectedQuality)?.label || 'تلقائي'}
            </button>

            {qualityMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl min-w-[120px] z-50">
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

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="bg-gray-900/90 hover:bg-black text-white p-1.5 md:p-2 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-gray-700"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 lg:rounded-xl border-y-2 lg:border-2 border-dashed border-gray-600 px-4 text-center">
      <span className="material-symbols-outlined text-5xl md:text-6xl text-gray-500 mb-4 animate-pulse">
        cast
      </span>
      <h2 className="text-lg md:text-2xl text-gray-400 font-semibold mb-2">الشاشة غير مفعلة حالياً</h2>
      <p className="text-gray-500 text-sm md:text-lg">في انتظار قيام المعلم ببدء البث...</p>
    </div>
  );
};

export default LiveStage;