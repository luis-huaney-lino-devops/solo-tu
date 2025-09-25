export interface SongSummary {
  id: number;
  titulo: string;
  artista: string;
  pista: string;
  foto_album: string;
  detalle_datos_musica: string;
  duracion: number;
}

export interface Lyric {
  time: number;
  text: string;
}

export interface SongDetail {
  nombre: string;
  artista: string;
  pista: string;
  foto_album: string;
  duracion: number;
  lyrics: Lyric[];
  fotografias?: Array<{ time: number; text: string }>;
}
