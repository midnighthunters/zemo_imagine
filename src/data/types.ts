export type ImagineCategory = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  group: string;
};

export type ImagineScrollItem = {
  id: string;
  categoryId: string;
  title: string;
  text: string;
  ttsText: string;
  rewardHint?: string;
};

export type CategoryGroup =
  | 'Travel'
  | 'Wealth'
  | 'Career'
  | 'Fitness'
  | 'Fantasy'
  | 'Luxury'
  | 'Relationships'
  | 'Skills'
  | 'Entertainment'
  | 'Peaceful Life'
  | 'Home'
  | 'Creativity'
  | 'Sports'
  | 'Food'
  | 'Nature'
  | 'Spirituality'
  | 'Technology'
  | 'Style'
  | 'Family'
  | 'Adventure';
