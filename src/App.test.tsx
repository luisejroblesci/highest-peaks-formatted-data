import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders highest peaks data heading', () => {
  render(<App />);
  const heading = screen.getByText(/highest peaks data/i);
  expect(heading).toBeInTheDocument();
});
