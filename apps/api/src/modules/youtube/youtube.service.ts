import { Ytdl } from "@distube/ytdl-core";
import type { YoutubeSearchOptions, YoutubeSearchResult } from "./youtube.types";

class Youtube {
  private readonly yt = new Ytdl();

  async search(query: string, options: YoutubeSearchOptions = {}): Promise<YoutubeSearchResult> {
    const { limit = 10 } = options;
    return this.yt.search(query, { limit });
  }

  async info(videoId: string) {
    return this.yt.getInfo(videoId);
  }
}

export const youtube = new Youtube();

