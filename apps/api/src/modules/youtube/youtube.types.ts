import type { VideoSummary } from "@distube/ytdl-core";
export type YoutubeSearchResult = readonly VideoSummary[];

export interface YoutubeSearchOptions {
  limit?: number;
}
