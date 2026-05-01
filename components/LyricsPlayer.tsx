'use client';
import { useState, useEffect, useCallback } from 'react';
import { Song, LyricLine } from '@/data/types';

interface Props {
  song: Song;
  onBack: () => void;
}

const SINGER_LABELS: Record<string, string> = {
  ella: 'ELLA',
  el: 'ÉL',
  ambos: 'AMBOS',
  solo: '',
  todos: 'TODOS',
};

// Returns tailwind text color class per singer role
function singerColor(singer: string, color1?: string, color2?: string): string {
  if (singer === 'ella') return 'text-pink-300';
  if (singer === 'el') return 'text-sky-300';
  if (singer === 'ambos' || singer === 'todos') return 'text-yellow-300';
  return 'text-white';
}

// Returns inline style color for singer badge
function singerBadgeStyle(singer: string): React.CSSProperties {
  if (singer === 'ella') return { background: 'rgba(236,72,153,0.25)', borderColor: '#f472b6' };
  if (singer === 'el') return { background: 'rgba(56,189,248,0.25)', borderColor: '#60a5fa' };
  if (singer === 'ambos' || singer === 'todos') return { background: 'rgba(250,204,21,0.25)', borderColor: '#fbbf24' };
  return { background: 'transparent', borderColor: 'transparent' };
}

export default function LyricsPlayer({ song, onBack }: Props) {
  const [activeLine, setActiveLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const isDuo = song.type === 'duo';
  const currentLine: LyricLine | undefined = song.lyrics[activeLine];

  // Reset when song changes
  useEffect(() => {
    setActiveLine(0);
    setDisplayedLines([]);
    setPlaying(false);
    setCharIndex(0);
    setFinished(false);
  }, [song.id]);

  // Typewriter: reveal chars of current line
  useEffect(() => {
    if (!playing || finished) return;
    if (!currentLine) return;

    if (charIndex < currentLine.text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 60);
      return () => clearTimeout(t);
    } else {
      // Line fully typed — wait then advance
      const t = setTimeout(() => advanceLine(), 1200);
      return () => clearTimeout(t);
    }
  }, [playing, charIndex, activeLine, finished]);

  const advanceLine = useCallback(() => {
    setDisplayedLines((prev) => [...prev, activeLine]);
    if (activeLine + 1 >= song.lyrics.length) {
      setFinished(true);
      setPlaying(false);
    } else {
      setActiveLine((l) => l + 1);
      setCharIndex(0);
    }
  }, [activeLine, song.lyrics.length]);

  const handlePlay = () => {
    if (finished) {
      setActiveLine(0);
      setDisplayedLines([]);
      setCharIndex(0);
      setFinished(false);
    }
    setPlaying(true);
  };

  const handlePause = () => setPlaying(false);

  const handleNext = () => {
    if (!finished) advanceLine();
  };

  const visibleLines = [...displayedLines, ...(playing || finished ? [] : [])];

  return (
    <div className="relative z-10 flex flex-col items-center w-full min-h-screen px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-pink-300 hover:text-white transition text-lg font-bold px-4 py-2 rounded-xl border border-pink-500/40 hover:border-pink-400 bg-black/30 hover:bg-pink-500/20"
        >
          ← Volver
        </button>
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(244,114,182,0.9)]">
            {song.title}
          </h1>
          <p className="text-pink-300 text-lg mt-1">{song.artists.join(' & ')}</p>
        </div>
        <div className="w-24" />
      </div>

      {/* Duo avatar labels */}
      {isDuo && (
        <div className="flex gap-8 mb-6">
          <div className="flex flex-col items-center gap-1">
            <div className="text-5xl">🎤</div>
            <span className="text-pink-300 font-black text-xl tracking-widest">ELLA</span>
            <span className="text-pink-200/70 text-sm">{song.artists[0]}</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-30 text-4xl font-black text-white">♥</div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-5xl">🎙️</div>
            <span className="text-sky-300 font-black text-xl tracking-widest">ÉL</span>
            <span className="text-sky-200/70 text-sm">{song.artists[1] ?? song.artists[0]}</span>
          </div>
        </div>
      )}

      {/* Lyrics area */}
      <div className="w-full max-w-4xl flex-1 flex flex-col gap-3 mb-8" style={{ minHeight: '350px' }}>
        {/* Past lines (faded) */}
        {displayedLines.map((idx) => {
          const line = song.lyrics[idx];
          return (
            <div
              key={idx}
              className={`flex items-baseline gap-3 opacity-30 transition-opacity duration-500`}
            >
              {isDuo && line.singer && line.singer !== 'solo' && (
                <span
                  className="text-xs font-black tracking-widest px-2 py-0.5 rounded-full border shrink-0"
                  style={singerBadgeStyle(line.singer)}
                >
                  {SINGER_LABELS[line.singer]}
                </span>
              )}
              <span className={`text-2xl md:text-3xl font-bold ${singerColor(line.singer ?? 'solo')}`}>
                {line.text} {line.emoji}
              </span>
            </div>
          );
        })}

        {/* Active line (typewriter) */}
        {(playing || charIndex > 0) && !finished && currentLine && (
          <div
            className="flex items-baseline gap-3"
            style={{
              animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {isDuo && currentLine.singer && currentLine.singer !== 'solo' && (
              <span
                className="text-sm font-black tracking-widest px-3 py-1 rounded-full border shrink-0 animate-pulse"
                style={singerBadgeStyle(currentLine.singer)}
              >
                {SINGER_LABELS[currentLine.singer]}
              </span>
            )}
            <span
              className={`text-4xl md:text-6xl font-black leading-tight drop-shadow-[0_0_30px_rgba(244,114,182,1)] ${singerColor(currentLine.singer ?? 'solo')}`}
              style={{ textShadow: '0 0 40px currentColor, 0 0 80px rgba(244,114,182,0.5)' }}
            >
              {currentLine.text.slice(0, charIndex)}
              <span className="animate-pulse opacity-80">|</span>
              {charIndex >= currentLine.text.length && currentLine.emoji && (
                <span className="ml-2 text-5xl">{currentLine.emoji}</span>
              )}
            </span>
          </div>
        )}

        {finished && (
          <div className="text-center mt-8">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-3xl font-black text-pink-300">¡Fin de la canción!</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-auto">
        {!playing ? (
          <button
            onClick={handlePlay}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-black text-2xl shadow-[0_0_40px_rgba(244,114,182,0.7)] hover:shadow-[0_0_60px_rgba(244,114,182,0.9)] hover:scale-105 transition-all"
          >
            {finished ? '🔄 Repetir' : '▶ Iniciar'}
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-xl hover:bg-white/20 transition"
            >
              ⏸ Pausa
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black text-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            >
              ⏭ Siguiente
            </button>
          </>
        )}
      </div>
    </div>
  );
}
