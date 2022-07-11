import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import mockApi from './mock/mockApi';

test('I am your test', () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(mockApi),
  }));
  render(<App />);
  const tablePlanets = screen.getByRole('table');
  expect(tablePlanets).toBeInTheDocument();
  expect(global.fetch).toBeCalledWith('https://swapi-trybe.herokuapp.com/api/planets/');

});
