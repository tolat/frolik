// Short Outing videos (10 seconds tops).
//
// Whatever the phone recorded (iPhone HEVC .mov, Android .mp4, a .webm from a
// browser) is converted to one small H.264/AAC .mp4 that plays everywhere,
// with the moov atom up front so it starts streaming at once. The conversion
// also enforces the length: anything over MAX_SECONDS (+ a little slack for
// rounding) is refused, and the output is cut at MAX_SECONDS regardless.
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");

const MAX_SECONDS = 10;
const SLACK_SECONDS = 0.6; // "10s" clips are often 10.3s
// Raw upload, before conversion: a 10s 4K60 iPhone clip can pass 70 MB
const MAX_UPLOAD_BYTES = 150 * 1024 * 1024;

const run = (args) =>
  new Promise((resolve) => {
    const proc = spawn(ffmpegPath, args);
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", (err) => resolve({ code: -1, stderr: String(err) }));
    proc.on("close", (code) => resolve({ code, stderr }));
  });

// "Duration: 00:00:10.43" from ffmpeg's banner (null if it can't read it)
const parseDuration = (stderr) => {
  const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(stderr);
  return m ? +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]) : null;
};

// -> { buffer, duration } or { error: "tooLong" | "unreadable" }
module.exports.processVideo = async (inputBuffer) => {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "frolik-video-"));
  const input = path.join(dir, "in");
  const output = path.join(dir, "out.mp4");
  try {
    await fs.promises.writeFile(input, inputBuffer);

    // Probe: no output file, ffmpeg exits non-zero but prints the duration
    const probe = await run(["-hide_banner", "-i", input]);
    const duration = parseDuration(probe.stderr);
    if (duration === null || !/Video:/.test(probe.stderr)) {
      return { error: "unreadable" };
    }
    if (duration > MAX_SECONDS + SLACK_SECONDS) return { error: "tooLong", duration };

    const result = await run([
      "-hide_banner",
      "-y",
      "-i", input,
      "-t", String(MAX_SECONDS),
      // 60fps phone clips: 30 is plenty here and halves the work
      "-fpsmax", "30",
      "-map", "0:v:0",
      "-map", "0:a:0?",
      // At most 720p on the long side, even dimensions, upright (ffmpeg
      // applies the phone's rotation flag itself)
      "-vf", "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'",
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "28",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "96k",
      "-movflags", "+faststart",
      output,
    ]);
    if (result.code !== 0) {
      console.error("[video] ffmpeg failed:", result.stderr.slice(-800));
      return { error: "unreadable" };
    }
    return { buffer: await fs.promises.readFile(output), duration: Math.min(duration, MAX_SECONDS) };
  } finally {
    fs.promises.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
};

module.exports.MAX_VIDEO_SECONDS = MAX_SECONDS;
module.exports.MAX_VIDEO_UPLOAD_BYTES = MAX_UPLOAD_BYTES;
