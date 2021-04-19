import dayjs from 'dayjs';
import { helpers, lorem } from 'faker';

const title1 = 'Just a sample title 1';
const title2 = 'Just a sample title 2';

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
    categoryId: 2,
    createdAt,
    updatedAt,
  },
];
export default VideoData;
