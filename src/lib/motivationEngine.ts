import { MotivationalQuote } from '@/types/fitness';

const inspiringQuotes: MotivationalQuote[] = [
  { quote: "The only bad workout is the one that didn't happen.", type: 'inspiring' },
  { quote: "Your body can stand almost anything. It's your mind you have to convince.", type: 'inspiring' },
  { quote: "One more rep is one step closer to your goals.", type: 'inspiring' },
  { quote: "Sweat is just fat crying.", type: 'inspiring' },
  { quote: "The pain you feel today will be the strength you feel tomorrow.", type: 'inspiring' },
  { quote: "Don't wish for it. Work for it.", type: 'inspiring' },
  { quote: "Your only limit is you.", type: 'inspiring' },
  { quote: "Fall in love with taking care of yourself.", type: 'inspiring' },
  { quote: "Progress, not perfection.", type: 'inspiring' },
  { quote: "Strong is the new beautiful.", type: 'inspiring' },
  { quote: "Every champion was once a contender who refused to give up.", type: 'inspiring' },
  { quote: "The difference between try and triumph is a little umph.", type: 'inspiring' },
];

const funnyQuotes: MotivationalQuote[] = [
  { quote: "Bro, that treadmill won't run itself.", type: 'funny' },
  { quote: "Exercise? I thought you said extra fries!", type: 'funny' },
  { quote: "My favorite exercise is a cross between a lunge and a crunch. I call it lunch.", type: 'funny' },
  { quote: "I don't sweat, I sparkle.", type: 'funny' },
  { quote: "Gym rule #1: If you're not huffing and puffing, are you even trying?", type: 'funny' },
  { quote: "My warmup is your workout. Just kidding, I'm also dying.", type: 'funny' },
  { quote: "Leg day: because stairs should fear you.", type: 'funny' },
  { quote: "Netflix and chill? More like weights and protein meals.", type: 'funny' },
  { quote: "I work out because I know I would have been the first to die in the Hunger Games.", type: 'funny' },
  { quote: "Sore today, swole tomorrow.", type: 'funny' },
];

const savageQuotes: MotivationalQuote[] = [
  { quote: "Skipping leg day? Criminal behaviour.", type: 'savage' },
  { quote: "Your excuses are as weak as your biceps.", type: 'savage' },
  { quote: "That 'rest day' every day lifestyle isn't working out, is it?", type: 'savage' },
  { quote: "Your comfort zone called. It's bored.", type: 'savage' },
  { quote: "Either you run the day, or the day runs over you.", type: 'savage' },
  { quote: "If it doesn't challenge you, it doesn't change you.", type: 'savage' },
  { quote: "Stop making excuses. Start making gains.", type: 'savage' },
  { quote: "The gym isn't going to come to your house and knock on the door.", type: 'savage' },
  { quote: "That pizza isn't going to burn itself. Get moving.", type: 'savage' },
  { quote: "You're not tired, you're uninspired. Let's fix that.", type: 'savage' },
  { quote: "Quitting? Not in your vocabulary. Get up.", type: 'savage' },
  { quote: "Your future self is watching you right now through memories.", type: 'savage' },
];

export const getDailyQuote = (type?: 'inspiring' | 'funny' | 'savage'): MotivationalQuote => {
  let quotes: MotivationalQuote[];
  
  switch (type) {
    case 'inspiring':
      quotes = inspiringQuotes;
      break;
    case 'funny':
      quotes = funnyQuotes;
      break;
    case 'savage':
      quotes = savageQuotes;
      break;
    default:
      quotes = [...inspiringQuotes, ...funnyQuotes, ...savageQuotes];
  }
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getWorkoutMotivation = (): string[] => {
  return [
    "Time to crush it! 💪",
    "Let's make today count!",
    "Your muscles are waiting!",
    "Another day, another opportunity to be better.",
    "Greatness awaits!",
  ];
};

export const getProgressCelebration = (achievement: string): string => {
  const celebrations: Record<string, string[]> = {
    workout_completed: [
      "Workout complete! You're a machine! 🔥",
      "Crushed it! That's how champions are made!",
      "Done! Your future self thanks you!",
    ],
    streak: [
      "Streak unlocked! Consistency is key! 🔑",
      "Look at you go! Keep that momentum!",
      "Unstoppable! That streak is fire!",
    ],
    weight_goal: [
      "Weight goal achieved! Incredible dedication! 🎯",
      "You did it! Hard work pays off!",
      "Goal smashed! Time to set a new one!",
    ],
    strength_gain: [
      "New PR! You're getting stronger! 💪",
      "Strength gains unlocked! Beast mode!",
      "Impressive! Your hard work shows!",
    ],
  };
  
  const messages = celebrations[achievement] || celebrations.workout_completed;
  return messages[Math.floor(Math.random() * messages.length)];
};
