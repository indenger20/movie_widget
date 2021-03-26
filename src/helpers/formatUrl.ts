import { MOVIE_IMAGE_PATH } from 'config/appConfig';

export const getImagePath = (path: string) => `${MOVIE_IMAGE_PATH}/w500${path}`;
