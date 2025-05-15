const ffmpeg = require("fluent-ffmpeg");
const path = require('path');
const fs = require('fs');

// extract original resolution
const getOriginalResolution = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      const { width, height } = metadata.streams.find(
        (s) => s.width && s.height
      );
      resolve({ width, height });
    });
  });
};

const transcodeVideo = (rawVideoPath, baseOutputPath) => {
  return function startTranscoding({ name, width, height, videoBitrate }) {
    return new Promise((resolve, reject) => {
      const outputPath = path.join(baseOutputPath, name);
      fs.mkdirSync(outputPath, { recursive: true });

      ffmpeg(rawVideoPath)
        .outputOptions([
          "-preset veryfast",
          "-g 50",
          "-sc_threshold 0",
          `-s ${width}x${height}`,
          `-b:v ${videoBitrate}`,
          "-c:a aac",
          "-b:a 128k",
          "-hls_time 10",
          "-hls_playlist_type vod",
          "-hls_segment_filename",
          `${outputPath}/segment_%03d.ts`,
        ])

        .videoCodec("libx264")
        .audioCodec("aac")
        .format("hls")
        .output(`${outputPath}/index.m3u8`)
        .on("start", (cmd) => {
          console.log(`Started processing ${name} with command: ${cmd}`);
        })

        .on("progress", (progress) => {
          console.log(
            `Processing ${name}: ${progress.percent?.toFixed(2)}% done`
          );
        })

        .on("end", () => {
          console.log(`Finished processing ${name}`);
          resolve();
        })

        .on("error", (err) => {
          console.error(`Error processing ${name}:`, err.message);
          reject(err);
        })

        .run();
    });
  };
};

module.exports = {transcodeVideo, getOriginalResolution};
