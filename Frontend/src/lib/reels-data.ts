export type InstagramReel = {
  id: string;
  instagramUrl: string;
  previewVideo: string;
  poster: string;
  title: string;
};

export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/";

export const instagramReels: InstagramReel[] = [
  {
    id: "reel-1",
    instagramUrl: "https://www.instagram.com/reel/DY_omJNNLX_/?igsh=MWhmNmk2dzBlazg5cg==",
    previewVideo: "/reels/reel-1.mp4",
    poster: "/reels/reel-1-poster.jpg",
    title: "Luxury sneaker showcase reel 1",
  },
  {
    id: "reel-2",
    instagramUrl: "https://www.instagram.com/reel/DQTDJdfEnUp/?igsh=MXJiZndwODRmeGhvbA==",
    previewVideo: "/reels/reel-2.mp4",
    poster: "/reels/reel-2-poster.jpg",
    title: "Designer footwear highlight reel 2",
  },
  {
    id: "reel-3",
    instagramUrl: "https://www.instagram.com/reel/DLfMqzsJx4_/?igsh=ZHJrN3BkN2lxNGUw",
    previewVideo: "/reels/reel-3.mp4",
    poster: "/reels/reel-3-poster.jpg",
    title: "Premium running shoes reel 3",
  },
  {
    id: "reel-4",
    instagramUrl: "https://www.instagram.com/reel/DGSN7iGTaJr/?igsh=MWl1cnRhZDl4YXFpZQ==",
    previewVideo: "/reels/reel-4.mp4",
    poster: "/reels/reel-4-poster.jpg",
    title: "Luxury shoes collection reel 4",
  },
  {
    id: "reel-5",
    instagramUrl: "https://www.instagram.com/reel/DFX0MYETFpS/?igsh=MXd4OW50dTB5MDli",
    previewVideo: "/reels/reel-5.mp4",
    poster: "/reels/reel-5-poster.jpg",
    title: "Street style luxury footwear reel 5",
  },
];
