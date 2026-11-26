"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Maximize, Settings, FastForward, AlertCircle, Loader2 } from "lucide-react";
import { decryptMediaUrl } from "@/functions/mediaSecurity";

import type { VideoSource } from "@/types/course";
export type { VideoSource } from "@/types/course";

export function detectVideoSource(url: string): VideoSource {
  if (!url) return { type: "mock", idOrUrl: "" };

  // 1. YouTube checks
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch) {
    return { type: "youtube", idOrUrl: ytMatch[1] };
  }
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return { type: "youtube", idOrUrl: url };
  }

  // 2. Google Drive checks
  const gdriveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/;
  const gdriveMatch = url.match(gdriveRegex);
  if (gdriveMatch) {
    return { type: "gdrive", idOrUrl: gdriveMatch[1] };
  }

  // 3. Vimeo checks
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return { type: "vimeo", idOrUrl: vimeoMatch[1] };
  }

  // 4. Cloudflare Stream checks
  if (url.includes("videodelivery.net") || url.includes("cloudflarestream.com")) {
    const cfRegex = /(?:videodelivery\.net|cloudflarestream\.com)\/([a-zA-Z0-9]+)/;
    const cfMatch = url.match(cfRegex);
    if (cfMatch) {
      return { type: "cloudflare", idOrUrl: cfMatch[1] };
    }
  }

  // 5. Native HTML5 (direct video paths)
  if (
    url.endsWith(".mp4") || 
    url.endsWith(".webm") || 
    url.endsWith(".ogg") || 
    url.startsWith("blob:") || 
    (url.startsWith("http") && (url.includes("video") || url.includes(".mp4")))
  ) {
    return { type: "html5", idOrUrl: url };
  }

  // 6. Otherwise fall back to mock/unresolvable
  return { type: "mock", idOrUrl: url };
}

interface VideoPlayerProps {
  url: string;
  title?: string;
  thumbnailUrl?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayerRefReady?: (playerRef: { setCurrentTime: (time: number) => void }) => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = "Lecture Video",
  thumbnailUrl,
  onTimeUpdate,
  onPlayerRefReady,
  onEnded
}) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string>(() => (url && url.startsWith("enc:v1:") ? "" : url));
  const [isDecrypting, setIsDecrypting] = useState<boolean>(() => Boolean(url && url.startsWith("enc:v1:")));

  useEffect(() => {
    let isMounted = true;
    if (url && url.startsWith("enc:v1:")) {
      setIsDecrypting(true);
      decryptMediaUrl(url).then((decrypted) => {
        if (isMounted) {
          setDecryptedUrl(decrypted);
          setIsDecrypting(false);
        }
      });
    } else {
      setDecryptedUrl(url || "");
      setIsDecrypting(false);
    }
    return () => {
      isMounted = false;
    };
  }, [url]);

  const activeUrl = decryptedUrl || (url && !url.startsWith("enc:v1:") ? url : "");
  const source = detectVideoSource(activeUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const [prevUrl, setPrevUrl] = useState(url);
  if (prevUrl !== url) {
    setPrevUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);
  }

  // Expose control API to parent component (e.g. jump to timestamp)
  useEffect(() => {
    if (onPlayerRefReady) {
      onPlayerRefReady({
        setCurrentTime: (time: number) => {
          if (source.type === "html5" && videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }
      });
    }
  }, [url, source.type, onPlayerRefReady]);

  // Handle native HTML5 video events
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const targetMute = !isMuted;
      videoRef.current.muted = targetMute;
      setIsMuted(targetMute);
      if (targetMute) {
        setVolume(0);
      } else {
        setVolume(0.8);
        videoRef.current.volume = 0.8;
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Embed Renderer for YouTube / Google Drive / Vimeo / Cloudflare
  const renderEmbed = () => {
    if (source.type === "youtube") {
      return (
        <div className="w-full h-full aspect-video">
          <iframe
            id="classroom-iframe"
            src={`https://www.youtube.com/embed/${source.idOrUrl}?autoplay=1&rel=0&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      );
    }

    if (source.type === "gdrive") {
      return (
        <div 
          className="w-full h-full aspect-video relative select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <iframe
            id="classroom-iframe"
            src={`https://drive.google.com/file/d/${source.idOrUrl}/preview`}
            title={title}
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full border-0 pointer-events-auto"
          ></iframe>
          {/* Invisible overlay over the top bar to block the "Pop-out" button and title */}
          <div 
            className="absolute top-0 left-0 right-0 h-16 bg-transparent z-20 pointer-events-auto cursor-default"
            title=""
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      );
    }

    if (source.type === "vimeo") {
      return (
        <div className="w-full h-full aspect-video">
          <iframe
            id="classroom-iframe"
            src={`https://player.vimeo.com/video/${source.idOrUrl}?autoplay=1&responsive=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      );
    }

    if (source.type === "cloudflare") {
      return (
        <div className="w-full h-full aspect-video">
          <iframe
            id="classroom-iframe"
            src={`https://iframe.videodelivery.net/${source.idOrUrl}?autoplay=true&muted=false&letterbox=false`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      );
    }

    return null;
  };

  // 1. Decrypting state
  if (isDecrypting) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl bg-black border border-gray-200 dark:border-gray-800 shadow-xl aspect-video flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-gray-400 font-semibold">Initializing secure media stream...</p>
      </div>
    );
  }

  // 2. Error state (Mock or empty URL)
  if (source.type === "mock") {
    return (
      <div 
        className="relative w-full overflow-hidden rounded-3xl bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl aspect-video flex flex-col items-center justify-center p-8 text-center space-y-3"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-red-600">Video Asset Not Available</h4>
          <p className="text-xs text-red-500/80 mt-1 font-semibold">The specified lecture video could not be resolved or is not configured.</p>
        </div>
      </div>
    );
  }

  // 3. Standard play mode (Embeds like Google Drive/YouTube are mounted directly for instant 1-click playback)
  return (
    <div 
      className={`relative w-full overflow-hidden rounded-3xl bg-black border border-gray-200 dark:border-gray-800 shadow-xl group/player select-none ${
        isTheaterMode ? "max-h-[80vh] aspect-[21/9]" : "aspect-video"
      }`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {source.type !== "html5" ? (
        renderEmbed()
      ) : (
        <div className="w-full h-full relative flex items-center justify-center">
          <video
            ref={videoRef}
            src={source.idOrUrl}
            poster={thumbnailUrl}
            className="w-full h-full cursor-pointer"
            onClick={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={onEnded}
            preload="metadata"
          />

          <div 
            onClick={handlePlayPause}
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
              !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="size-16 sm:size-20 rounded-full bg-blue-600/90 border border-blue-400/40 text-white flex items-center justify-center shadow-xl transition-transform duration-300 transform hover:scale-110">
              <Play fill="white" size={28} className="translate-x-0.5 text-white" />
            </div>
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-3 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}>
            
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-white">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleScrubberChange}
                className="flex-1 h-1 rounded-lg bg-white/20 accent-brand-500 cursor-pointer appearance-none outline-none focus:outline-none transition-all hover:h-1.5"
              />
              <span className="text-[11px] font-bold text-white/60">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between mt-1">
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePlayPause}
                  className="text-white hover:text-brand-400 transition-colors"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime -= 10;
                  }}
                  className="text-white hover:text-brand-400 transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw size={16} />
                </button>

                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMute} className="text-white hover:text-brand-400 transition-colors">
                    <Volume2 size={16} className={isMuted ? "text-red-500" : ""} />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 rounded bg-white/30 accent-brand-500 appearance-none outline-none cursor-pointer group-hover/volume:w-20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4.5">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 border border-white/5">
                  <FastForward size={12} className="text-white/60" />
                  <select 
                    value={playbackRate}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="bg-transparent border-none text-[11px] text-white font-bold uppercase outline-none select-none cursor-pointer text-center"
                  >
                    <option className="bg-gray-900 text-white" value="0.5">0.5x</option>
                    <option className="bg-gray-900 text-white" value="1">1.0x</option>
                    <option className="bg-gray-900 text-white" value="1.25">1.25x</option>
                    <option className="bg-gray-900 text-white" value="1.5">1.5x</option>
                    <option className="bg-gray-900 text-white" value="2">2.0x</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className="text-white hover:text-brand-400 transition-colors hidden sm:block"
                  title="Toggle Theater Mode"
                >
                  <Settings size={16} className={isTheaterMode ? "text-brand-500 animate-spin" : ""} />
                </button>

                <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:text-brand-400 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize size={16} />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
