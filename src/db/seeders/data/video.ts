import dayjs from 'dayjs';
import { helpers, lorem } from 'faker';

const title1 = 'Just a sample title 1';
const title2 = 'Just a sample title 2';
const title3 = 'Just a sample title 3';

// generate createdDate and updateDate
const createdAt = dayjs().format();
const updatedAt = createdAt;

const VideoData = [
  {
    slug: helpers.slugify(title1),
    link: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
    title: title1,
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    shared: false,
    userId: 1,
    avgRate: 3.5,
    categoryId: 1,
    createdAt,
    updatedAt,
  },
  {
    slug: helpers.slugify(title2),
    link: 'https://www.youtube.com/watch?v=ojJupoAyT58',
    title: title2,
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    shared: false,
    userId: 1,
    avgRate: 5,
    totalRaters: 3,
    categoryId: 2,
    createdAt,
    updatedAt,
  },
  {
    slug: helpers.slugify(title3),
    link: 'https://www.youtube.com/watch?v=ojJupoAyT58',
    title: title2,
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    shared: false,
    userId: 1,
    avgRate: 4,
    totalRaters: 1,
    categoryId: 2,
    createdAt,
    updatedAt,
  },
];
export default VideoData;
