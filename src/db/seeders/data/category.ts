import dayjs from 'dayjs';
import ECategory from '../../../interfaces/category';

// generate createdDate and updateDate
const createdAt = dayjs().format();
const updatedAt = createdAt;

const CategoryData = [
  {
    name: ECategory.MUSIC_VIDEO,
    createdAt,
    updatedAt,
  },
  {
    name: ECategory.PODCAST,
    createdAt,
    updatedAt,
  },
  {
    name: ECategory.LEFOCUS,
    createdAt,
    updatedAt,
  },
  {
    name: ECategory.INTERVIEW,
    createdAt,
    updatedAt,
  },
  {
    name: ECategory.FLEXBEATZ,
    createdAt,
    updatedAt,
  },
];
export default CategoryData;
