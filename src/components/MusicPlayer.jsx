import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { lyrics as aboutYouLyrics } from '../data/aboutData';
import { lyrics as lesungPipiLyrics } from '../data/lesungpipiData';
import { lyrics as senjaLyrics } from '../data/senjaData';

function MusicPlayer({
  musicPlaying,
  setMusicPlaying,
  audioError,
  setAudioError,
  selectedSong
}) {
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const getSongData = () => {
    if (selectedSong === 'lesungpipi') {
      return {
        src: '/LesungPipi.mp3',
        title: 'Lesung Pipi',
        artist: 'Raim Laode',
        lyrics: lesungPipiLyrics
      };
    }

    if (selectedSong === 'senja') {
      return {
        src: '/Senja.mp3',
        title: 'Senja',
        artist: 'Raim Laode',
        lyrics: senjaLyrics
      };
    }

    return {
      src: '/AboutYou.mp3',
      title: 'About You',
      artist: 'The 1975',
      lyrics: aboutYouLyrics
    };
  };

  const songData = getSongData();

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (songData.lyrics[0]?.text) {
      setDisplayText(songData.lyrics[0].text);
    }
  }, [selectedSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && musicPlaying) {
      const updateLyric = () => {
        if (!audioRef.current) return;

        const currentLyrics = songData.lyrics;
        const currentAudioTime = audioRef.current.currentTime;

        let newIndex = 0;
        for (let i = currentLyrics.length - 1; i >= 0; i--) {
          if (currentAudioTime >= currentLyrics[i].time) {
            newIndex = i;
            break;
          }
        }

        if (newIndex !== currentLyricIndex) {
          setCurrentLyricIndex(newIndex);
          setDisplayText(currentLyrics[newIndex].text);

          const lyricElement = document.querySelector('.current-lyric');
          if (lyricElement) {
            gsap.killTweensOf(lyricElement);
            gsap.fromTo(lyricElement,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          }
        }

        animationRef.current = requestAnimationFrame(updateLyric);
      };

      animationRef.current = requestAnimationFrame(updateLyric);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [musicPlaying, currentLyricIndex, selectedSong, songData.lyrics]);

  // Ganti lagu
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = musicPlaying;

      if (wasPlaying) {
        audioRef.current.pause();
      }

      audioRef.current.src = songData.src;
      audioRef.current.load();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;

      setCurrentLyricIndex(0);
      if (songData.lyrics[0]?.text) {
        setDisplayText(songData.lyrics[0].text);
      }
      setCurrentTime(0);
    }
  }, [selectedSong]);

  // Handle play/pause
  useEffect(() => {
    if (musicPlaying && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setAudioError(false);
        })
        .catch((e) => {
          console.log(e);
          setAudioError(true);
        });
    } else if (!musicPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [musicPlaying, setAudioError]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    setMusicPlaying(!musicPlaying);
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        onError={() => setAudioError(true)}
      />

      {/* Music Player - Di ATAS (top) biar ga nutup lirik */}
      <div 
        className={`fixed z-50 transition-all duration-500 ${
          isMinimized 
            ? 'top-20 right-4 w-14 h-14 rounded-full' 
            : 'top-20 right-4 w-64 md:w-72 rounded-2xl'
        } bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl`}
      >
        {isMinimized ? (
          // Mini Player
          <button 
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src="/music.gif"
              alt="music"
              className={`w-10 h-10 rounded-full object-cover ${musicPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: '5s' }}
            />
          </button>
        ) : (
          // Full Player
          <div className="p-3 md:p-4">
            {/* Tombol minimize */}
            <button 
              onClick={() => setIsMinimized(true)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Visualizer */}
            <div className="flex items-end justify-center gap-[3px] h-8 md:h-12 mb-2 md:mb-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-full"
                  style={{
                    width: '2px',
                    height: musicPlaying ? 'auto' : '3px',
                    animation: musicPlaying ? `visualizerWave ${0.3 + i * 0.05}s ease-in-out infinite alternate` : 'none',
                    transformOrigin: 'bottom'
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleMusic} className="flex-shrink-0">
                <img
                  src="/music.gif"
                  alt="vinyl"
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-all duration-300 ${
                    musicPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '5s' }}
                />
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-[8px] md:text-[10px] text-gray-400 tracking-[0.25em]">
                  NOW PLAYING
                </p>
                <p className="text-white text-xs md:text-sm font-medium truncate">
                  {songData.title}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 truncate">
                  {songData.artist}
                </p>
              </div>
            </div>

            <div className="mt-3 md:mt-4">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[8px] md:text-[10px] text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lyrics - Di BAWAH player (biar ga ketutupan) */}
      <div className="fixed bottom-8 md:bottom-12 left-0 right-0 z-40 pointer-events-none px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p
            key={currentLyricIndex}
            className="current-lyric text-sm md:text-xl lg:text-2xl text-white font-medium leading-relaxed tracking-wide"
            style={{ fontFamily: "'Pixelify Sans', 'Courier New', monospace" }}
          >
            {displayText || '🎵'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes visualizerWave {
          0% { height: 3px; opacity: 0.3; }
          100% { height: 20px; opacity: 1; }
        }
        @media (min-width: 768px) {
          @keyframes visualizerWave {
            0% { height: 4px; opacity: 0.3; }
            100% { height: 28px; opacity: 1; }
          }
        }
      `}</style>
    </>
  );
}

export default MusicPlayer;
