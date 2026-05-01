export type SingerRole = 'ella' | 'el' | 'ambos' | 'solo' | 'todos';

export interface LyricLine {
  text: string;
  singer?: SingerRole;
  emoji?: string;
  delay?: number; // ms between chars for typewriter
}

export interface Song {
  id: string;
  title: string;
  artists: string[];
  category: CategoryId;
  type: 'duo' | 'solo';
  color1?: string; // primary singer color
  color2?: string; // secondary singer color
  lyrics: LyricLine[];
}

export type CategoryId =
  | 'duo'
  | 'solitario'
  | 'para-llorar'
  | 'karaoke-divertido'
  | 'disfrutar'
  | 'eleccion'
  | 'random';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  gradient: string;
}
