import BlueHouse from '@/assets/svg/blue_house.svg?react';
import GreenHouse from '@/assets/svg/green_house.svg?react';
import PinkHouse from '@/assets/svg/pink_house.svg?react';
import YellowHouse from '@/assets/svg/yellow_house.svg?react';

export const REGIONS = [
  { 
    id: 'blueHouse',   
    ariaLabel: 'Blue House - Communication Skills',   
    x: '25%', 
    y: '45%', 
    icon: <BlueHouse />,   
    initialProgress: 0,
    lessonId: 'unit-1-why-people-do-what-they-do',
    title: 'Why People Do What They Do',
    description: 'Explore how culture, socialization, and groups shape behavior',
    color: 'blue',
    difficulty: 'beginner'
  },
  { 
    id: 'greenHouse',  
    ariaLabel: 'Green House - Emotional Intelligence',  
    x: '45%', 
    y: '50%', 
    icon: <GreenHouse />,  
    initialProgress: 0,
    lessonId: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    description: 'Understand and manage emotions',
    color: 'green',
    difficulty: 'intermediate'
  },
  { 
    id: 'pinkHouse',   
    ariaLabel: 'Pink House - Building Relationships',   
    x: '65%', 
    y: '45%', 
    icon: <PinkHouse />,   
    initialProgress: 0,
    lessonId: 'building-relationships',
    title: 'Building Relationships',
    description: 'Create meaningful connections',
    color: 'pink',
    difficulty: 'beginner'
  },
  { 
    id: 'yellowHouse', 
    ariaLabel: 'Yellow House - Conflict Resolution', 
    x: '85%', 
    y: '55%', 
    icon: <YellowHouse />, 
    initialProgress: 0,
    lessonId: 'conflict-resolution',
    title: 'Conflict Resolution',
    description: 'Master conflict management strategies',
    color: 'yellow',
    difficulty: 'advanced'
  },
] as const;

export type RegionId = typeof REGIONS[number]['id'];
