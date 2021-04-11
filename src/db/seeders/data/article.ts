import dayjs from 'dayjs';
import { lorem, helpers } from 'faker';

const title1 = 'How to Doggie';
const title2 = 'Just a sample title';

// generate createdDate and updateDate
const createdAt = dayjs().format();
const updatedAt = createdAt;

const ArticleData = [
  {
    slug: helpers.slugify(title1),
    title: title1,
    summary: lorem.words(300),
    body: lorem.words(1000),
    images: ['https://dougie.jpg'],
    video: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    liked: false,
    likeCount: 0,
    userId: 4,
    createdAt,
    updatedAt,
  },
  {
    slug: helpers.slugify(title2),
    title: title2,
    summary: lorem.words(200),
    body: lorem.words(1250),
    images: ['https://dougie.jpg'],
    video: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
    tags: [lorem.words(1), lorem.words(1), lorem.words(1)],
    liked: true,
    likeCount: 10,
    userId: 5,
    createdAt,
    updatedAt,
  },
];
export default ArticleData;
