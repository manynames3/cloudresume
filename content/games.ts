export interface Game {
  id: string; title: string; category: string; description: string; detail: string;
  alt: string; caption: string; status: string; original: string; image: string;
  width: number; height: number; project?: string; release?: string; play?: string;
}

export const games: readonly Game[] = [
  {
    "id": "doodle-rumble",
    "title": "Doodle Rumble",
    "category": "Hand-drawn arcade fighter",
    "description": "A drawing from my children became a 2D arcade fighter: hollow-headed doodles, oversized weapons, and local battles inside a computer desktop.",
    "detail": "The original drawing’s personality stays at the center—even as the cast, arenas, and draw-your-own-fighter workshop grow.",
    "alt": "Doodle Rumble gameplay with Orange spinning a pitchfork against Blue in the illustrated Desktop Dojo arena",
    "caption": "Native gameplay capture / Desktop Dojo",
    "project": "https://github.com/manynames3/doodle-rumble",
    "release": "https://github.com/manynames3/doodle-rumble/releases/tag/v0.7.7",
    "status": "Mac game / public project",
    "original": "/games/originals/doodle-rumble.png",
    "image": "/games/doodle-rumble.webp",
    "width": 1280,
    "height": 720
  },
  {
    "id": "cat-racers",
    "title": "Cat Racers",
    "category": "Cats, karts & handmade worlds",
    "description": "A playful 3D kart racer with a cast of cats, paper-craft courses, drifting, boosts, and just enough chaos to make another lap tempting.",
    "detail": "Part of Doodle Rally, with distinct racers and courses, difficulty choices, and a chase camera that puts you behind the kart.",
    "alt": "Cat Racers gameplay showing Zizi boosting a red kart behind rival cats through the rocky Block Quarry course",
    "caption": "Gameplay capture / Block Quarry",
    "project": "https://github.com/manynames3/doodle-rally",
    "status": "Mac game / public project",
    "original": "/games/originals/cat-racers.png",
    "image": "/games/cat-racers.webp",
    "width": 1280,
    "height": 800
  },
  {
    "id": "lumen",
    "project": "https://github.com/manynames3/lumen-and-the-lost-lanterns",
    "title": "Lumen",
    "category": "Lumen and the Lost Lanterns",
    "description": "A small lantern-bearer and a black cat explore forgotten floating ruins. Reveal hidden paths, awaken mechanisms, and bring light back to quiet places.",
    "detail": "A storybook exploration-platformer built around companionship, environmental puzzles, and a world changed by light.",
    "alt": "Lumen and a black cat explore Blossom Heights, with pink flowering trees, floating ruins, and a lantern-lit stone arch at sunset",
    "caption": "Mac playtest capture / Blossom Heights",
    "status": "In development / Mac playtest",
    "original": "/games/originals/lumen.png",
    "image": "/games/lumen.webp",
    "width": 1280,
    "height": 720
  },
  {
    "id": "resonance",
    "project": "https://github.com/manynames3/resonance",
    "title": "Resonance",
    "category": "Music-led adventure",
    "description": "A guitar-led adventure where musical call-and-response becomes the language of encounters. Melody practice and a keyboard preview sit alongside the developing guitar-input path.",
    "detail": "This project brings together my interest in guitar and game-making. Read the six string lanes and fret-number cues, then answer the melody. The screenshot shows keyboard-preview gameplay; physical-guitar validation remains ongoing.",
    "alt": "Resonance gameplay showing a guitar-carrying traveler facing the Echo Mimic, with E minor pentatonic notes and fret numbers approaching the hit line on six guitar-string lanes",
    "caption": "2.5D gameplay capture / Melody Lab · keyboard preview",
    "status": "In development / guitar & keyboard prototype",
    "original": "/games/originals/resonance.png",
    "image": "/games/resonance.webp",
    "width": 1280,
    "height": 720
  },
  {
    "id": "lunchbox",
    "project": "https://github.com/manynames3/lunchbox-game",
    "title": "Lunchbox",
    "category": "Lunchbox Rush",
    "description": "Fit an illustrated school lunch into an impossible little box. Rotate food pieces, keep hot food away from cold desserts, and solve one small packing puzzle at a time.",
    "detail": "A cozy puzzle game with an illustrated home-to-school journey, gradual introductions, and a lunchbox that grows with the challenge.",
    "alt": "Lunchbox Rush cover menu showing a family packing a turquoise lunchbox in a sunny kitchen, with Play, Journey map, and Lunchbook controls",
    "caption": "Mac playtest capture / cover menu",
    "status": "In development / Mac playtest",
    "original": "/games/originals/lunchbox.jpg",
    "image": "/games/lunchbox.webp",
    "width": 1280,
    "height": 739
  },
  {
    "id": "belly-float",
    "project": "https://github.com/manynames3/bellyfloat",
    "title": "Belly Float",
    "category": "A watercolor otter adventure",
    "description": "Drift through watercolor coves as a playful otter. Crack shellfish to gentle rhythms, solve tidepool and pebble puzzles, and help your neighbors prepare a sunset picnic.",
    "detail": "A cozy browser game built around curiosity and forgiving play: missed taps get another chance, discoveries stay, and small seaside activities invite you to linger.",
    "alt": "Belly Float gameplay in Little Tide Cove, with a floating otter, Pip resting in kelp, shellfish, and activity markers surrounded by watercolor rocks and blue water",
    "caption": "Live browser gameplay capture / Little Tide Cove",
    "status": "Playable browser game / in development",
    "play": "https://bellyfloat.pages.dev/",
    "original": "/games/originals/belly-float.png",
    "image": "/games/belly-float.webp",
    "width": 1280,
    "height": 800
  }
];
