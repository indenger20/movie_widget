import { MOVIE_IMAGE_PATH } from 'config/appConfig';
import { getPersentage, getImagePath } from './formatUrl';

describe('getPersentage', () => {
  it('should return zero', () => {
    expect(getPersentage(0)).toEqual(0);
  });
  it('should return 10', () => {
    expect(getPersentage(1)).toEqual(10);
  });
});

describe('getImagePath', () => {
  it('should return path', () => {
    const str = 'url-to-image.png';
    expect(getImagePath(str)).toEqual(`${MOVIE_IMAGE_PATH}/w500${str}`);
  });
});
