import { Song, CategoryId } from './types';
import { DUO_SONGS } from './songs-duo';
import { SOLITARIO_SONGS } from './songs-solitario';
import { LLORAR_SONGS } from './songs-llorar';
import { KARAOKE_SONGS } from './songs-karaoke';
import { DISFRUTAR_SONGS } from './songs-disfrutar';
import { ELECCION_SONGS } from './songs-eleccion';
import { RANDOM_SONGS } from './songs-random';

export const ALL_SONGS: Song[] = [
  ...DUO_SONGS,
  ...SOLITARIO_SONGS,
  ...LLORAR_SONGS,
  ...KARAOKE_SONGS,
  ...DISFRUTAR_SONGS,
  ...ELECCION_SONGS,
  ...RANDOM_SONGS,
];

export function getSongsByCategory(categoryId: CategoryId): Song[] {
  return ALL_SONGS.filter((s) => s.category === categoryId);
}

export function getSongById(id: string): Song | undefined {
  return ALL_SONGS.find((s) => s.id === id);
}
