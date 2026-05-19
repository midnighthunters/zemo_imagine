import { CategoryGroup, ImagineCategory } from './types';

type CategoryBlueprint = {
  group: CategoryGroup;
  emoji: string;
  roots: string[];
  descriptions: string[];
};

const blueprints: CategoryBlueprint[] = [
  { group: 'Travel', emoji: '✈️', roots: ['Luxury Travel', 'Tokyo Nights', 'Beach Escape', 'European Summer', 'Road Trip', 'Mountain Retreat'], descriptions: ['Dream destinations, passport stamps, and cinematic arrivals.', 'Cities, islands, lounges, trains, and once-in-a-lifetime views.'] },
  { group: 'Wealth', emoji: '💎', roots: ['First Million', 'Investor Life', 'Rich Lifestyle', 'Passive Income', 'Private Banking', 'Abundant Future'], descriptions: ['Money confidence, elegant choices, and calm financial power.', 'A future where wealth gives you freedom, taste, and options.'] },
  { group: 'Career', emoji: '🚀', roots: ['Founder Era', 'Dream Job', 'Executive Life', 'Creator Business', 'Global Career', 'Public Speaker'], descriptions: ['Career wins, leadership rooms, launches, and visible momentum.', 'Work that makes your future feel bigger and more respected.'] },
  { group: 'Fitness', emoji: '🔥', roots: ['Glow Up', 'Runner Body', 'Strong Future', 'Athlete Mindset', 'Yoga Reset', 'Healthy Discipline'], descriptions: ['Energy, discipline, strength, confidence, and a body that carries you.', 'A future where your health becomes quiet daily power.'] },
  { group: 'Fantasy', emoji: '🐉', roots: ['Dragon Realm', 'Magic Academy', 'Royal Quest', 'Crystal Forest', 'Space Kingdom', 'Mythic Hero'], descriptions: ['Immersive fantasy futures, impossible worlds, and heroic versions of you.', 'A playful escape into wonder, magic, and cinematic adventure.'] },
  { group: 'Luxury', emoji: '🖤', roots: ['Penthouse Life', 'Designer Wardrobe', 'Supercar Morning', 'Private Villa', 'Fine Dining', 'Yacht Weekend'], descriptions: ['Beautiful objects, refined spaces, and high-end everyday rituals.', 'A polished future full of taste, comfort, and sensory detail.'] },
  { group: 'Relationships', emoji: '💫', roots: ['Dream Love', 'Magnetic Social Life', 'Wedding Future', 'Friend Circle', 'Romantic City', 'Confident Presence'], descriptions: ['Connection, romance, friendship, and being deeply chosen.', 'Social futures where you feel seen, safe, and sparkling.'] },
  { group: 'Skills', emoji: '📚', roots: ['Polyglot Life', 'Piano Mastery', 'Coding Confidence', 'Writer Future', 'Chef Skills', 'Learning Streak'], descriptions: ['Skills that make your life more capable, expressive, and free.', 'Small mastery moments that compound into an impressive future.'] },
  { group: 'Entertainment', emoji: '🎭', roots: ['Concert Night', 'Film Premiere', 'Gaming Legend', 'Festival Summer', 'Comedy Stage', 'Celebrity Moment'], descriptions: ['Stadium lights, stage energy, fandom, and unforgettable nights.', 'A future that feels loud, playful, and alive with culture.'] },
  { group: 'Peaceful Life', emoji: '🌙', roots: ['Slow Morning', 'Quiet Cabin', 'Garden Life', 'Digital Detox', 'Soft Reset', 'Calm Wealth'], descriptions: ['Stillness, spacious days, nervous-system ease, and gentle routines.', 'Peaceful futures that feel like a long breath out.'] },
  { group: 'Home', emoji: '🏡', roots: ['Dream Home', 'City Apartment', 'Lake House', 'Minimal Studio', 'Family Kitchen', 'Library Room'], descriptions: ['Homes that hold your taste, safety, rituals, and future memories.', 'Rooms, views, textures, and routines that feel deeply yours.'] },
  { group: 'Creativity', emoji: '🎨', roots: ['Artist Studio', 'Book Launch', 'Music Era', 'Design Life', 'Photography Trip', 'Creative Director'], descriptions: ['Creative futures with output, beauty, confidence, and recognition.', 'The version of you who makes things instead of only imagining them.'] },
  { group: 'Sports', emoji: '🏟️', roots: ['Matchday VIP', 'World Cup Trip', 'Marathon Finish', 'Tennis Club', 'Basketball Court', 'Formula Weekend'], descriptions: ['Sporting arenas, athletic moments, competition, and electric crowds.', 'A high-energy future built from motion, pride, and performance.'] },
  { group: 'Food', emoji: '🍜', roots: ['Tokyo Food Tour', 'Chef Table', 'Italian Summer', 'Cafe Morning', 'Street Food Map', 'Dinner Party'], descriptions: ['Taste-led futures full of markets, restaurants, kitchens, and people.', 'A future where flavor becomes travel, memory, and connection.'] },
  { group: 'Nature', emoji: '🌲', roots: ['Forest Cabin', 'Ocean Swim', 'Desert Dawn', 'Alpine Trail', 'Island Garden', 'Rainy Retreat'], descriptions: ['Landscapes, fresh air, water, and the quiet intelligence of nature.', 'Outdoor futures that restore your attention and widen your life.'] },
  { group: 'Spirituality', emoji: '🕯️', roots: ['Meditation Path', 'Temple Morning', 'Sacred Travel', 'Inner Peace', 'Moon Ritual', 'Gratitude Life'], descriptions: ['Meaning, devotion, reflection, and a calmer inner world.', 'Futures where your spirit feels steady, awake, and guided.'] },
  { group: 'Technology', emoji: '🤖', roots: ['AI Founder', 'Future City', 'Robot Home', 'Space Tourist', 'Biohacker Life', 'Smart Studio'], descriptions: ['Tomorrow-facing lives with tools, systems, invention, and momentum.', 'A future where technology expands your reach and imagination.'] },
  { group: 'Style', emoji: '✨', roots: ['Signature Style', 'Luxury Fragrance', 'Paris Wardrobe', 'Red Carpet', 'Tailored Life', 'Beauty Ritual'], descriptions: ['Presence, grooming, clothes, taste, and the feeling of becoming iconic.', 'A future where your outer world reflects your inner confidence.'] },
  { group: 'Family', emoji: '🤍', roots: ['Family Holiday', 'Parent Future', 'Sunday Table', 'Generational Wealth', 'Sibling Trip', 'Legacy Home'], descriptions: ['Warm futures around care, legacy, roots, and shared memories.', 'A life where success includes the people you love.'] },
  { group: 'Adventure', emoji: '🧭', roots: ['Safari Morning', 'Scuba Dive', 'Northern Lights', 'Volcano Hike', 'Sailing Week', 'Jungle Lodge'], descriptions: ['Bold futures with movement, discovery, courage, and wide-open stories.', 'Adventures that make your life feel bigger than your routine.'] },
];

const variants = ['Vision', 'Escape', 'Map', 'Ritual', 'Era', 'Quest', 'Board', 'Glow', 'Dream', 'Reset', 'Story', 'Key'];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const categories: ImagineCategory[] = blueprints.flatMap((blueprint) =>
  variants.map((variant, index) => {
    const root = blueprint.roots[index % blueprint.roots.length];
    const title = index % 3 === 0 ? root : `${root} ${variant}`;

    return {
      id: slugify(`${blueprint.group}-${title}-${index + 1}`),
      title,
      emoji: blueprint.emoji,
      description: blueprint.descriptions[index % blueprint.descriptions.length],
      group: blueprint.group,
    };
  }),
);

export const categoryById = new Map(categories.map((category) => [category.id, category]));

export const categoryGroups = Array.from(new Set(categories.map((category) => category.group)));
