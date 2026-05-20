export type Reward = {
  id: string;
  title: string;
  emoji: string;
  group: string;
};

export const rewardCatalog: Reward[] = [
  { id: 'dubai-sticker', title: 'Dubai Skyline Sticker', emoji: '🏙️', group: 'Travel' },
  { id: 'million-badge', title: 'First Million Badge', emoji: '💰', group: 'Wealth' },
  { id: 'tokyo-stamp', title: 'Tokyo Night Stamp', emoji: '🗼', group: 'Travel' },
  { id: 'home-key', title: 'Dream Home Key', emoji: '🔑', group: 'Home' },
  { id: 'founder-badge', title: 'Founder Spark Badge', emoji: '💡', group: 'Career' },
  { id: 'dragon-egg', title: 'Dragon Egg', emoji: '🥚', group: 'Fantasy' },
  { id: 'business-badge', title: 'Business Class Badge', emoji: '💺', group: 'Luxury' },
  { id: 'cabin-stamp', title: 'Quiet Cabin Stamp', emoji: '🏕️', group: 'Nature' },
  { id: 'marathon-flame', title: 'Marathon Flame', emoji: '🔥', group: 'Sports' },
  { id: 'wardrobe-pin', title: 'Paris Wardrobe Pin', emoji: '👗', group: 'Style' },
];

export const defaultBoards = [
  'Travel Future',
  'Wealth Future',
  'Dream Home',
  'Career Future',
  'Fitness Future',
  'Fantasy Future',
  'Luxury Future',
  'Peaceful Life',
];
