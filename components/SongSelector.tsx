'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { getSongsByCategory } from '@/data/songs';
import { Song, Category, CategoryId } from '@/data/types';

interface Props {
  onSelect: (song: Song) => void;
}

export default function SongSelector({ onSelect }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const selectedCat = CATEGORIES.find((c) => c.id === activeCategory);
  const songs = activeCategory ? getSongsByCategory(activeCategory) : [];

  return (
    <div className="relative z-10 flex flex-col items-center w-full min-h-screen px-4 py-10">
      {/* Title */}
      <div className="mb-10 text-center">
        <h1
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(135deg, #f9a8d4, #f472b6, #e879f9, #a78bfa)',
            filter: 'drop-shadow(0 0 30px rgba(244,114,182,0.8))',
          }}
        >
          🎤 KARAOKE
        </h1>
        <p className="text-pink-300 text-xl mt-2 tracking-widest font-light">
          70 canciones · 7 categorías
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-4xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
            className={`px-6 py-3 rounded-2xl font-black text-lg transition-all duration-200 border-2 ${
              activeCategory === cat.id
                ? 'scale-110 border-white text-white shadow-[0_0_30px_rgba(244,114,182,0.8)]'
                : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white hover:scale-105'
            } bg-gradient-to-r ${cat.gradient} bg-opacity-20`}
            style={{
              background:
                activeCategory === cat.id
                  ? undefined
                  : 'rgba(255,255,255,0.05)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Song grid */}
      {activeCategory && (
        <div className="w-full max-w-5xl">
          <h2
            className={`text-3xl font-black text-center mb-6 bg-gradient-to-r ${selectedCat?.gradient} bg-clip-text text-transparent`}
          >
            {selectedCat?.emoji} {selectedCat?.label.replace(/[^\w\s]/gi, '').trim()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {!activeCategory && (
        <p className="text-white/40 text-xl mt-4">← Elige una categoría para ver las canciones</p>
      )}
    </div>
  );
}

function SongCard({ song, onSelect }: { song: Song; onSelect: (s: Song) => void }) {
  const isDuo = song.type === 'duo';
  return (
    <button
      onClick={() => onSelect(song)}
      className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400/60 hover:bg-white/10 transition-all duration-200 hover:scale-[1.03] text-left overflow-hidden"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${song.color1 ?? '#f472b6'}33, transparent 70%)`,
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          {isDuo ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/30 font-bold">
              💑 DÚO
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/30 font-bold">
              🎤 SOLO
            </span>
          )}
        </div>
        <h3 className="text-white font-black text-xl leading-tight group-hover:text-pink-200 transition-colors">
          {song.title}
        </h3>
        <p className="text-white/50 text-sm mt-1">{song.artists.join(' & ')}</p>
      </div>
    </button>
  );
}
