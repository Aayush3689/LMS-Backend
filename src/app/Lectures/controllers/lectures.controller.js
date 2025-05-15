const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const {
  transcodeVideo,
  getOriginalResolution,
} = require("@services/ffmpeg/video.transcoding");

// prettier-ignore
const allResolutions = [
  { name: "240p", width: 426, height: 240, videoBitrate: "400k", bandwidth: 500000},
  { name: "320p", width: 568, height: 320, videoBitrate: "600k", bandwidth: 700000 },
  { name: "480p", width: 854, height: 480, videoBitrate: "1000k", bandwidth: 1200000 },
  { name: "720p", width: 1280, height: 720, videoBitrate: "2500k", bandwidth: 2800000 },
  { name: "1080p", width: 1920, height: 1080, videoBitrate: "3000k", bandwidth: 3500000 },
];

const handleUploadLecture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file uploaded" });
  }

  const rawVideoPath = req.file.path;
  const lectureId = uuid();
  const baseUrl = "http://localhost:3000";
  const baseOutputPath = path.join("processed", lectureId);

  // start processing
  const startTranscoding = transcodeVideo(rawVideoPath, baseOutputPath);

  try {
    const originalResolution = await getOriginalResolution(rawVideoPath);
    console.log(
      `original resolution: ${originalResolution.width}x${originalResolution.height}`
    );
    const allowedResolutions = allResolutions.filter(
      (r) =>
        r.width <= originalResolution.width &&
        r.height <= originalResolution.height
    );
    await Promise.all(allowedResolutions.map(startTranscoding));

    // generate master playlist
    const masterPlaylistPath = path.join(baseOutputPath, "master.m3u8");
    let masterPlaylistContent = "#EXTM3U\n";

    allowedResolutions.forEach(({ name, width, height, bandwidth }) => {
      masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${width}x${height}\n`;
      masterPlaylistContent += `${name}/index.m3u8\n`;
    });

    fs.mkdirSync(baseOutputPath, { recursive: true });
    fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

    return res.json({
      lectureId,
      rawVideoPath,
      masterPlaylist: `${baseUrl}/processed/${lectureId}/master.m3u8`,
    });
  } catch (error) {
    console.log(
      "error jaha pe Promise.all(allowedResolutions.map(startTranscoding)) likha hua hai",
      error
    );
    return res.status(500).json({ error: "Failed to process lecture" });
  }
};

module.exports = handleUploadLecture;
