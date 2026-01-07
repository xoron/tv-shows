import { Show, Episode } from '../types';

export const showData: Show = {
  id: 'powerpuff-girls',
  title: 'The Powerpuff Girls',
  description: 'The Powerpuff Girls is an American superhero animated television series created by animator Craig McCracken for Cartoon Network. The series centers on Blossom, Bubbles, and Buttercup, three girls with superpowers, as well as their father, the brainy scientist Professor Utonium, who all live in the fictional city of Townsville. The girls are frequently called upon by the town\'s childlike and naive mayor to help fight nearby criminals and other enemies using their powers.',
  coverImage: 'https://placehold.co/600x900/FF69B4/white?text=Powerpuff+Girls',
};

export const episodesData: Episode[] = [
  {
    id: '1',
    showId: 'powerpuff-girls',
    season: 1,
    episodeNumber: 1,
    title: 'Monkey See, Doggy Do',
    summary: 'An evil genius simian named Mojo Jojo creates three evil girls and plans to take over Townsville. The Professor tells the girls how they were created. The girls realize they are not evil, but good. The girls defeat Mojo Jojo and become Townsville\'s newest heroes.',
    coverImage: 'https://placehold.co/600x400/9370DB/white?text=Episode+1',
  },
  {
    id: '2',
    showId: 'powerpuff-girls',
    season: 1,
    episodeNumber: 2,
    title: 'Insect Inside',
    summary: 'A giant cockroach named Roach Coach invades Townsville and turns its citizens into insects. The Powerpuff Girls must stop him before the entire town is taken over.',
    coverImage: 'https://placehold.co/600x400/32CD32/white?text=Episode+2',
  },
  {
    id: '3',
    showId: 'powerpuff-girls',
    season: 1,
    episodeNumber: 3,
    title: 'Powerpuff Bluff',
    summary: 'The Amoeba Boys cause trouble in Townsville by performing small crimes that annoy the citizens. The girls try to stop them, but their lack of serious criminal intent makes it difficult.',
    coverImage: 'https://placehold.co/600x400/4169E1/white?text=Episode+3',
  },
  {
    id: '4',
    showId: 'powerpuff-girls',
    season: 1,
    episodeNumber: 4,
    title: 'Octi Evil',
    summary: 'HIM uses Blossom\'s doll Octi to manipulate the girls and turn them against each other. The girls must realize what\'s happening and work together to defeat HIM.',
    coverImage: 'https://placehold.co/600x400/DC143C/white?text=Episode+4',
  },
  {
    id: '5',
    showId: 'powerpuff-girls',
    season: 1,
    episodeNumber: 5,
    title: 'Ghetto Defender',
    summary: 'The Gangreen Gang causes chaos in Townsville. The Powerpuff Girls must stop them from destroying the city.',
    coverImage: 'https://placehold.co/600x400/FF8C00/white?text=Episode+5',
  },
  {
    id: '6',
    showId: 'powerpuff-girls',
    season: 1,
    episodeNumber: 6,
    title: 'Mommy Fearest',
    summary: 'A new nanny named Ima Goodlady comes to work for the Professor and the girls, but she\'s actually Sedusa in disguise. The girls must figure out her true identity.',
    coverImage: 'https://placehold.co/600x400/9932CC/white?text=Episode+6',
  },
];
