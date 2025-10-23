import BlueHouse from '@/assets/svg/blue_house.svg?react';
import GreenHouse from '@/assets/svg/green_house.svg?react';
import PinkHouse from '@/assets/svg/pink_house.svg?react';
import YellowHouse from '@/assets/svg/yellow_house.svg?react';

export const REGIONS = [
  { id: 'blueHouse',   ariaLabel: 'Blue House',   x: '25%', y: '45%', icon: <BlueHouse />,   initialProgress: 0 },
  { id: 'greenHouse',  ariaLabel: 'Green House',  x: '45%', y: '50%', icon: <GreenHouse />,  initialProgress: 0 },
  { id: 'pinkHouse',   ariaLabel: 'Pink House',   x: '65%', y: '45%', icon: <PinkHouse />,   initialProgress: 0 },
  { id: 'yellowHouse', ariaLabel: 'Yellow House', x: '85%', y: '55%', icon: <YellowHouse />, initialProgress: 0 },
] as const;

export type RegionId = typeof REGIONS[number]['id'];
