/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class PromotionValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  createPlan = async (): Promise<void> => {
    await validate.price(this.req, 'price');
    await validate.duration(this.req, 'duration');
  };

  createAds = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_PROMOTION_TITLE'));
    await validate.empty(this.req, 'legend', this.req.t('LABEL_PROMOTION_LEGEND'));
    await validate.empty(this.req, 'subTitle', this.req.t('LABEL_PROMOTION_SUBTITLE'));
    await validate.empty(this.req, 'body', this.req.t('LABEL_PROMOTION_BODY'));
    await validate.url(this.req, 'redirectUrl', this.req.t('LABEL_PROMOTION_URL'));
    await validate.url(this.req, 'image', this.req.t('LABEL_ADS_IMAGE'));
    await validate.date(this.req, 'startDate', this.req.t('LABEL_PROMOTION_STARTDATE'));
  };

  createStory = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_PROMOTION_TITLE'));
    await validate.empty(this.req, 'legend', this.req.t('LABEL_PROMOTION_LEGEND'));
    await validate.empty(this.req, 'subTitle', this.req.t('LABEL_PROMOTION_SUBTITLE'));
    await validate.empty(this.req, 'body', this.req.t('LABEL_PROMOTION_BODY'));
    await validate.url(this.req, 'redirectUrl', this.req.t('LABEL_PROMOTION_URL'));
    await validate.url(this.req, 'media', this.req.t('LABEL_STORY_MEDIA'));
    await validate.empty(this.req, 'mediaType', this.req.t('LABEL_STORY_MEDIA_TYPE'));
    await validate.date(this.req, 'startDate', this.req.t('LABEL_PROMOTION_STARTDATE'));
  };

  updateAds = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_PROMOTION_TITLE'));
    await validate.empty(this.req, 'legend', this.req.t('LABEL_PROMOTION_LEGEND'));
    await validate.empty(this.req, 'subTitle', this.req.t('LABEL_PROMOTION_SUBTITLE'));
    await validate.empty(this.req, 'body', this.req.t('LABEL_PROMOTION_BODY'));
    await validate.url(this.req, 'redirectUrl', this.req.t('LABEL_PROMOTION_URL'));
    await validate.url(this.req, 'image', this.req.t('LABEL_ADS_IMAGE'));
  };

  updateStory = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_PROMOTION_TITLE'));
    await validate.empty(this.req, 'legend', this.req.t('LABEL_PROMOTION_LEGEND'));
    await validate.empty(this.req, 'subTitle', this.req.t('LABEL_PROMOTION_SUBTITLE'));
    await validate.empty(this.req, 'body', this.req.t('LABEL_PROMOTION_BODY'));
    await validate.url(this.req, 'redirectUrl', this.req.t('LABEL_PROMOTION_URL'));
    await validate.url(this.req, 'media', this.req.t('LABEL_STORY_MEDIA'));
    await validate.empty(this.req, 'mediaType', this.req.t('LABEL_STORY_MEDIA_TYPE'));
  };
}

export default PromotionValidator;
