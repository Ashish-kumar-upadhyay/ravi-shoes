export type ReelItem = {
  id: string;
  title: string;
  videoUrl: string;
};

const CLOUDINARY_VIDEOS = [
  "https://res.cloudinary.com/rdsryhgm/video/upload/v1783524858/Video-249_lhie2z.mp4",
  "https://res.cloudinary.com/rdsryhgm/video/upload/v1783524859/Video-881_ajavhf.mp4",
  "https://res.cloudinary.com/rdsryhgm/video/upload/v1783525186/AQMyvmDd4temt14kSOmwxX8DN1ee-8UZuRfmP5n3cqg4OtJ4sUCc1PWJhX0wpm6GQPWZAiMyjhhaS8xdZNQG9Sgnw79nsfsgoLm_QQs_b47uph.mp4",
  "https://res.cloudinary.com/rdsryhgm/video/upload/v1783524857/Video-286_uisvff.mp4",
  "https://res.cloudinary.com/rdsryhgm/video/upload/v1783525370/AQPcYMRFpDGkzFHQtuTlrkVvnQdhjkbE5W8BLqFi0oydFwqfjIa5XrQLO2xPnLHW7KQipwZaahuu9vfLSaDY6Lll_NZN1kMO6A6Mj_Y_vyknts.mp4",
] as const;

/** Lightweight streaming URL — auto format/quality, capped width for performance. */
export function optimizeCloudinaryVideo(url: string, width = 520) {
  return url.replace("/video/upload/", `/video/upload/f_auto,q_auto,w_${width},c_limit/`);
}

/** First-frame poster to avoid layout flash before video loads. */
export function cloudinaryPoster(url: string, width = 520) {
  return url
    .replace("/video/upload/", `/video/upload/so_0,w_${width},h_924,c_fill,f_jpg,q_auto/`)
    .replace(".mp4", ".jpg");
}

export const reels: ReelItem[] = CLOUDINARY_VIDEOS.map((videoUrl, index) => ({
  id: `reel-${index + 1}`,
  title: `Luxury style reel ${index + 1}`,
  videoUrl,
}));
