import { Profile } from './Interfaces/Profile';
export const profileData: Record<number, Profile> = {
  1: {
    id: 1,
    nickname: 'JonJon',
    name: 'Jonas',
    surname: 'Jonaitis',
    email: 'Jonaitis@gmail.com',
    accountType: 'Naudotojas',
    password: 'pass123',
    number: '+37065',
    birthdate: new Date('1998-01-16'),
    reviewCount: 2,
    gender: 'male',
  },
};
