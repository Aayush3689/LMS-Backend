// const ffmpeg = require("fluent-ffmpeg");
// const path = require("path");
// const { v4: uuid } = require("uuid");

// const handleUploadLecture = async (req, res) => {
//   const rawVideoPath = req.file.path;
//   const lectureId = uuid();
//   const videoUrl = [];
//   console.log("req.file", req.file);

//   const resolutions = [
//     { name: "240p", width: 426, height: 240, videoBitrate: "400k" },
//     { name: "320p", width: 568, height: 320, videoBitrate: "600k" },
//     { name: "480p", width: 854, height: 480, videoBitrate: "1000k" },
//     { name: "1080p", width: 1920, height: 1080, videoBitrate: "3000k" },
//   ];

//   resolutions.forEach(({ name, width, height, videoBitrate }) => {
//     const outputPath = `processed/${lectureId}/${name}`;

//     ffmpeg(rawVideoPath)
//       .outputOptions([
//         "-preset veryfast", // fast encoding
//         "-g 50", // keyframe interval (important for HLS)
//         "-sc_threshold 0", // scene cut detection
//         `-s ${width}x${height}`, // resolution
//         `-b:v ${videoBitrate}`, // video bitrate
//         "-c:a aac",
//         "-b:a 128k",
//         "-hls_time 10", // 10 sec segments
//         "-hls_playlist_type vod",
//         "-hls_segment_filename",
//         `${outputPath}/segment_%03d.ts`,
//       ])
//       .videoCodec("libx264")
//       .audioCodec("aac")
//       .format("hls")
//       .output(`${outputPath}/index.m3u8`)
//       .on("start", (cmd) => {
//         console.log(`Started processing ${name} with command: ${cmd}`);
//       })
//       .on("progress", (progress) => {
//         console.log(`Processing ${name}: ${progress.percent}% done`);
//       })
//       .on("end", () => {
//         console.log(`Processing finished for ${name}`);
//       })
//       .on("error", (err) => {
//         console.error(`Error processing ${name}:`, err.message);
//       })
//       .run();

//     videoUrl.push(`http://${outputPath}/index.m3u8`);
//   });

//   return res.json({
//     videoUrl: videoUrl,
//   });
// };

// module.exports = handleUploadLecture;

const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const { v4: uuid } = require("uuid");

const handleUploadLecture = async (req, res) => {
  const rawVideoPath = req.file.path;
  const lectureId = uuid();
  const videoUrls = [];
  const baseUrl = 'http://localhost:3000'
  const baseOutputPath = path.join("processed", lectureId);

  const resolutions = [
    { name: "240p", width: 426, height: 240, videoBitrate: "400k", bandwidth: 500000 },
    { name: "320p", width: 568, height: 320, videoBitrate: "600k", bandwidth: 700000 },
    { name: "480p", width: 854, height: 480, videoBitrate: "1000k", bandwidth: 1200000 },
    { name: "1080p", width: 1920, height: 1080, videoBitrate: "3000k", bandwidth: 3500000 },
  ];

  const processResolution = ({ name, width, height, videoBitrate }) => {
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
          console.log(`Processing ${name}: ${progress.percent}% done`);
        })
        .on("end", () => {
          console.log(`Finished processing ${name}`);
          videoUrls.push(`${baseUrl}/${lectureId}/${name}/index.m3u8`);
          resolve();
        })
        .on("error", (err) => {
          console.error(`Error processing ${name}:`, err.message);
          reject(err);
        })
        .run();
    });
  };

  try {
    await Promise.all(resolutions.map(processResolution));

    // Generate Master Playlist
    const masterPlaylistPath = path.join(baseOutputPath, "master.m3u8");
    let masterPlaylistContent = "#EXTM3U\n";

    resolutions.forEach(({ name, width, height, bandwidth }) => {
      masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${width}x${height}\n`;
      masterPlaylistContent += `${name}/index.m3u8\n`;
    });

    fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

    return res.json({
      lectureId,
      videoUrls,
      rawVideoPath,
      masterPlayList: `${baseUrl}/processed/master.m3u8`
    });
  } catch (err) {
    console.error("Error during lecture processing", err);
    return res.status(500).json({ error: "Failed to process lecture" });
  }
};

module.exports = handleUploadLecture;

