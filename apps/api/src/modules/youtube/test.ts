import { Quality, Ytdl, chooseFormat } from "@distube/ytdl-core";

import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

const yt = new Ytdl();

function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);
    let stderr = "";

    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    ffmpeg.once("error", reject);

    ffmpeg.once("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg failed: ${stderr}`));
    });
  });
}

export async function downloadYoutubeVideo(url: string): Promise<string> {
  const info = await yt.getInfo(url);

  const videoFormat = chooseFormat(info.formats, {
    quality: Quality.HighestVideo,
    filter: {
      hasVideo: true,
      hasAudio: false,
      container: "mp4",
    },
  });

  const audioFormat = chooseFormat(info.formats, {
    quality: Quality.HighestAudio,
    filter: {
      hasAudio: true,
      hasVideo: false,
    },
  });

  const outputDir = join(process.cwd(), "downloads");
  await mkdir(outputDir, { recursive: true });

  const tempDir = await mkdtemp(join(tmpdir(), "youtube-"));

  const videoPath = join(tempDir, "video.mp4");
  const audioPath = join(tempDir, "audio");
  const mergedPath = join(tempDir, "merged.mp4");

  const outputPath = join(outputDir, `mahmoud.mp4`);

  try {
    console.log({
      title: info.videoDetails.title,
      video: videoFormat.qualityLabel,
      audio: audioFormat.audioCodec,
    });

    await Promise.all([
      pipeline(
        yt.download(info, { format: videoFormat }),
        createWriteStream(videoPath),
      ),
      pipeline(
        yt.download(info, { format: audioFormat }),
        createWriteStream(audioPath),
      ),
    ]);

    await runFFmpeg([
      "-i",
      videoPath,
      "-i",
      audioPath,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      "-y",
      mergedPath,
    ]);

    await rename(mergedPath, outputPath);

    return outputPath;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
