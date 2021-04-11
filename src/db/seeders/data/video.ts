import dayjs from 'dayjs';
import { lorem } from 'faker';

const title1 = 'Just a sample title 1';
const title2 = 'Just a sample title 2';

// generate createdDate and updateDate
const createdAt = dayjs().format();
const updatedAt = createdAt;

const VideoData = [
  {
    link: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
    title: title1,
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    shared: false,
    shareCount: 0,
    userId: 1,
    categoryId: 1,
    createdAt,
    updatedAt,
  },
  {
    link: 'https://www.youtube.com/watch?v=ojJupoAyT58',
    title: title2,
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    shared: false,
    shareCount: 0,
    userId: 1,
    categoryId: 2,
    createdAt,
    updatedAt,
  },
];
export default VideoData;
