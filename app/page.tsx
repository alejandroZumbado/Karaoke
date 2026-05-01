'use client';
import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import SongSelector from '@/components/SongSelector';
import LyricsPlayer from '@/components/LyricsPlayer';
import { Song } from '@/data/types';

export default function Home() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0010 0%, #0d0020 50%, #100015 100%)' }}
    >
      {/* Ambient gradient blobs */}
      <div
        className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <ParticleBackground />

      {selectedSong ? (
        <LyricsPlayer song={selectedSong} onBack={() => setSelectedSong(null)} />
      ) : (
        <SongSelector onSelect={setSelectedSong} />
      )}
    </main>
  );
}
