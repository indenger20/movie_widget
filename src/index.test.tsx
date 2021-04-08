import React from 'react';
import { render } from '@testing-library/react';
import { ProviderConfig } from 'helpers/app/providerConfig';
import { IPeople, MovieWidgetComponent } from './index';

describe('Widgets', () => {
  let configService: ProviderConfig;
  const movieFilter: IPeople = {
    adult: true,
    id: 2,
    name: 'Some person name',
    popularity: 1,
    profile_path: 'path',
  };

  beforeEach(() => {
    configService = new ProviderConfig({ apiKey: '123', language: 'en' });
  });
  test('Render Movie Widget', () => {
    const config = configService.getCongig();

    const { getByText } = render(<MovieWidgetComponent config={config} />);
    const title = getByText(/Search Movies/i);

    expect(title).toBeDefined();
  });

  test('Render Movie Widget with filter', () => {
    const config = configService.getCongig();

    const { getByText } = render(
      <MovieWidgetComponent config={config} filter={movieFilter} />,
    );
    const regExp = new RegExp(
      `Search Movies by people: ${movieFilter.name}`,
      'i',
    );
    const title = getByText(regExp);

    expect(title).toBeDefined();
  });
});
