interface Users {
  all: number;
  verified: number;
  unverified: number;
}

interface Articles {
  all: number;
  liked: number;
  commented: number;
}

interface Videos {
  all: number;
  rated: number;
  shared: number;
}

interface Promotions {
  all: number;
  active: number;
  inactive: number;
}

interface General {
  users: Users;
  articles: Articles;
  videos: Videos;
  promotions: Promotions;
}

interface IOverview {
  general: General;
}

export default IOverview;
