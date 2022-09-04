import express from 'express';
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import i18next from 'i18next';
import backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import apiV1 from './api';
import { notFoundError } from './helpers/api';

class App {
  public express = express();

  constructor() {
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(hpp());
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(morgan('dev'));
    this.express.use(express.json());

    i18next
      .use(backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        preload: ['fr'],
        fallbackLng: 'fr',
        backend: {
          loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
        },
        interpolation: {
          escapeValue: false,
        },
      });
    this.express.use(i18nextMiddleware.handle(i18next));
  }

  private setRoutes(): void {
    this.express.use('/api/v1', apiV1);
  }

  private catchErrors(): void {
    this.express.use(notFoundError);
  }
}

const app = new App().express;
export default app;
