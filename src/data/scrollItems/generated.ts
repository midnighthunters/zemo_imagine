import { ImagineCategory, ImagineScrollItem } from '../types';

const openers = [
  'Imagine your future self stepping into',
  'Picture a quiet morning inside',
  'Visualise the first moment you realise',
  'See yourself choosing',
  'Imagine opening your eyes to',
];

const textures = [
  'a lifestyle that once felt far away but now feels close enough to touch',
  'a scene full of light, movement, and proof that your life expanded',
  'a confident version of you who makes choices from calm instead of fear',
  'a cinematic moment that turns a private dream into something visible',
  'a small daily ritual that quietly changes the direction of your life',
];

const endings = [
  'Save this future if it gives you energy.',
  'Let the voice play and notice what your body wants.',
  'Swipe when you are ready for the next possible life.',
  'Add this to your board if it feels like a real signal.',
  'Use this as a tiny reminder of what you are building.',
];

export const buildScrollItemsForCategory = (
  category: ImagineCategory,
  moodLine = 'This card is here to help you decide whether this future belongs in your life.',
): ImagineScrollItem[] =>
  Array.from({ length: 100 }, (_, index) => {
    const number = index + 1;
    const text = `${openers[index % openers.length]} ${category.title} future number ${number}: ${textures[index % textures.length]}. You pause, breathe, and give the scene ten honest seconds. ${moodLine} ${endings[index % endings.length]}`;

    return {
      id: `${category.id}-${String(number).padStart(3, '0')}`,
      categoryId: category.id,
      title: `Imagine ${category.title} #${number}`,
      text,
      ttsText: `${category.title}. ${text}`,
      rewardHint: `${category.title} Sticker ${number}`,
    };
  });
