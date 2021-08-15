const NUMERIC_SYSTEM = 16;
const NUMBERS_IN_RGB = 6;
const firstPart = [
  'Ford',
  'BMW',
  'Jeep',
  'Volvo',
  'Opel',
  'Jiguli',
  'Ferrari',
  'Mitsubishi',
  'Skoda',
  'Belaz',
];
const secondPart = [
  'НЕзбагОЙный',
  'P a F F o S S H H ы Й',
  'ecl!pse ',
  'Anime',
  'TaTaPuH ',
  'NaGiB4Uk',
  'ApAsNыЙ',
  'gopSTOP',
  'gonschik',
  'piton',
];
function getRandomInInterval(interval: number): number {
  return Math.floor(Math.random() * interval);
}

export default function getRandomName(): string {
  return `${firstPart[getRandomInInterval(firstPart.length)]} ${
    secondPart[getRandomInInterval(secondPart.length)]
  }`;
}
export function getRandomColor(): string {
  return `#${getRandomInInterval(NUMERIC_SYSTEM ** NUMBERS_IN_RGB).toString(NUMERIC_SYSTEM)}`;
}
