// Outing media can be photos or short videos. Video keys end in .mp4 (the
// server converts every upload to one), so a media URL — signed S3 or
// /local-images — tells us which it is without extra data.
export const MAX_VIDEO_SECONDS = 10;
// Matches the server's limit: a 10s 4K60 iPhone clip can pass 70 MB
export const MAX_VIDEO_BYTES = 150 * 1024 * 1024;

export const isVideoUrl = (url) =>
  typeof url === "string" && /\.mp4(\?|#|$)/i.test(url.split("?")[0] + "?");

export const isVideoFile = (file) =>
  !!file && (/^video\//.test(file.type) || /\.(mp4|mov|m4v|webm|3gp)$/i.test(file.name || ""));

// Seconds, read from the file's own metadata (null if the browser can't
// read it — Chrome can't open iPhone HEVC .mov files and never answers, so
// give up quickly; the server checks the length either way)
export const videoFileDuration = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    let done = false;
    const finish = (d) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(d) ? d : null);
    };
    v.preload = "metadata";
    v.muted = true;
    v.onloadedmetadata = () => finish(v.duration);
    v.onerror = () => finish(null);
    setTimeout(() => finish(null), 1500);
    v.src = url;
  });
