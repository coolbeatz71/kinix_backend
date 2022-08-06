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

interface IGeneralOverview {
  users: Users;
  articles: Articles;
  videos: Videos;
  promotions: Promotions;
}

interface UserActivity {
  active: number;
  inactive: number;
}
interface UserProvider {
  local: number;
  google: number;
  facebook: number;
}

type UserNotification = UserActivity;

interface UserRole {
  ads: number;
  admin: number;
  video: number;
  viewer: number;
  superAdmin: number;
}

interface IUserOverview {
  activity: UserActivity;
  provider: UserProvider;
  notification: UserNotification;
  role: UserRole;
}

interface IOverview {
  general: IGeneralOverview;
  users: IUserOverview;
}

export default IOverview;
