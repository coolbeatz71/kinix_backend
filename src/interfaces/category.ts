/**
 * videos on the discovery section
 * must be the 3 least videos from each category
 */
enum ECategory {
  MUSIC_VIDEO = 'MUSIC_VIDEO',
  INTERVIEW = 'INTERVIEW',
  PODCAST = 'PODCAST',
  LEFOCUS = 'LEFOCUS',
  FLEXBEATZ = 'FLEX&BEATZ',
  ADS_PROMO = 'ADS_PROMO',
  STORY_PROMO = 'STORY_PROMO',
}

export enum EUserStatus {
  ALL = 'ALL',
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum EArticleStatus {
  ALL = 'ALL',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
}

export enum EVideoStatus {
  ALL = 'ALL',
  RATE = 'RATE',
  SHARE = 'SHARE',
}

export enum EPromotionStatus {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export default ECategory;
