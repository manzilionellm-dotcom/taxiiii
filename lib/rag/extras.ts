import extras from "@/data/rag-extras.json";
import links from "@/data/youtube-links.json";
import type { CorpusDoc } from "@/lib/rag/search";

interface TranscriptNote {
  id: string;
  youtubeId?: string;
  title: string;
  text_sv?: string;
  text_fr?: string;
  text?: string;
  source?: string;
  topic?: string;
}

interface VideoLink {
  id: string;
  title: string;
  url: string;
  topics?: string[];
  use?: string[];
  notes?: string;
  highFreqThemes?: string[];
}

function asNotes(value: unknown): TranscriptNote[] {
  if (Array.isArray(value)) return value as TranscriptNote[];
  return [];
}

function asVideos(value: unknown): VideoLink[] {
  if (Array.isArray(value)) return value as VideoLink[];
  if (value && typeof value === "object" && "videos" in value) {
    const videos = (value as { videos?: VideoLink[] }).videos;
    return Array.isArray(videos) ? videos : [];
  }
  return [];
}

export function youtubeDocs(): CorpusDoc[] {
  const notes = asNotes(extras);
  const videos = asVideos(links);
  const fromNotes = notes.map((note) => ({
    id: note.id,
    questionId: note.id,
    text: [
      note.id,
      note.title,
      note.text_sv ?? "",
      note.text_fr ?? "",
      note.text ?? "",
      note.youtubeId ?? "",
      note.source ?? "",
      note.topic ?? "",
      "research youtube transcript rag",
    ].join("\n"),
  }));
  const fromLinks = videos.map((video) => ({
    id: `yt-link:${video.id}`,
    questionId: `yt:${video.id}`,
    text: [
      video.title,
      video.url,
      ...(video.topics ?? []),
      ...(video.use ?? []),
      video.notes ?? "",
      ...(video.highFreqThemes ?? []),
      "youtube research calcul rag",
    ].join("\n"),
  }));
  return [...fromNotes, ...fromLinks];
}
