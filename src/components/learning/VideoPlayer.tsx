"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Maximize, Settings, FastForward } from "lucide-react";

export interface VideoSource {
  type: "youtube" | "vimeo" | "cloudflare" | "html5";
  idOrUrl: string;
}

export function detectVideoSource(url: string): VideoSource {
  if (!url) return { type: "html5", idOrUrl: "" };

  // 1. YouTube checks
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch) {
    return { type: "youtube", idOrUrl: ytMatch[1] };
  }
  
  // If it's a known placeholder or a simple YouTube ID, support it
  if (url === "BasicsMemoryLayoutYouTubeId") {
    return { type: "youtube", idOrUrl: "9Hdf8_y4s_A" }; // A sample premium educational DSA video
  }
  if (url === "TwoPointersPatternYouTubeId") {
    return { type: "youtube", idOrUrl: "t3W8l0N27-c" }; // A sample Two Pointers lecture
  }
  if (url === "BinaryTreeStrategyYouTubeId") {
    return { type: "youtube", idOrUrl: "fAAZixBjIAI" }; // A sample Binary Tree lecture
  }
  if (url === "DPIntroductionYouTubeId") {
    return { type: "youtube", idOrUrl: "oBt53YbR9K8" }; // A sample Dynamic Programming lecture
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return { type: "youtube", idOrUrl: url };
  }

  // 2. Vimeo checks
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return { type: "vimeo", idOrUrl: vimeoMatch[1] };
  }

  // 3. Cloudflare Stream checks
  if (url.includes("videodelivery.net") || url.includes("cloudflarestream.com")) {
    const cfRegex = /(?:videodelivery\.net|cloudflarestream\.com)\/([a-zA-Z0-9]+)/;
    const cfMatch = url.match(cfRegex);
    if (cfMatch) {
      return { type: "cloudflare", idOrUrl: cfMatch[1] };
    }
  }

  // 4. Default to HTML5 native player
  return { type: "html5", idOrUrl: url };
}

interface VideoPlayerProps {
  url: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayerRefReady?: (playerRef: { setCurrentTime: (time: number) => void }) => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = "Lecture Video",
  onTimeUpdate,
  onPlayerRefReady,
  onEnded
}) => {
  const source = detectVideoSource(url);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Expose control API to parent component (e.g. jump to timestamp)
  useEffect(() => {
    if (onPlayerRefReady) {
      onPlayerRefReady({
        setCurrentTime: (time: number) => {
          if (source.type === "html5" && videoRef.current) {
            videoRef.current.currentTime = time;
          } else {
            // For YouTube embeds, we can alert or log. Real control requires iframe-api, 
            // but we can trigger a reload with start time as a robust fallback!
            const iframe = document.querySelector("#classroom-iframe") as HTMLIFrameElement;
            if (iframe && source.type === "youtube") {
              iframe.src = `https://youtu.be/ejt86EZ4Y5o=`;
            } else if (iframe && source.type === "cloudflare") {
              iframe.src = `https://iframe.videodelivery.net/${source.idOrUrl}?autoplay=true&time=${Math.floor(time)}s`;
            }
          }
        }
      });
    }
  }, [url, source.type, source.idOrUrl, onPlayerRefReady]);

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

  // Embed Renderer for YouTube / Vimeo / Cloudflare
  const renderEmbed = () => {
    if (source.type === "youtube") {
      return (
        <div className="w-full h-full aspect-video">
          <iframe
            id="classroom-iframe"
            src={`https://www.youtube.com/embed/${source.idOrUrl}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
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

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-3xl bg-black border border-gray-200 dark:border-gray-800 shadow-xl group/player ${
        isTheaterMode ? "max-h-[80vh] aspect-[21/9]" : "aspect-video"
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {source.type !== "html5" ? (
        // Render Iframe Embed
        renderEmbed()
      ) : (
        // Render Custom HTML5 Video Player
        <div className="w-full h-full relative flex items-center justify-center">
          <video
            ref={videoRef}
            src={source.idOrUrl}
            className="w-full h-full cursor-pointer"
            onClick={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={onEnded}
            preload="metadata"
          />

          {/* Glowing Play/Pause Indicator on Center Click */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`p-5 rounded-full bg-brand-500/20 backdrop-blur-md border border-brand-500/40 text-white transition-all duration-300 scale-75 opacity-0 ${
              !isPlaying && !showControls ? "scale-100 opacity-100" : ""
            }`}>
              <Play fill="white" size={32} className="ml-1" />
            </div>
          </div>

          {/* Custom Overlay Controls */}
          <div className={`absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-3 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}>
            
            {/* Scrubber Timeline */}
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

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between mt-1">
              
              {/* Playback Trigger Buttons */}
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

                {/* Volume bar */}
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

              {/* Advanced Player Settings */}
              <div className="flex items-center gap-4.5">
                {/* Custom Playback Speeds */}
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

                {/* Theater Mode Trigger */}
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
