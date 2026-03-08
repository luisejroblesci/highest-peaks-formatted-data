import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders claude chat heading', () => {
  render(<App />);
  const heading = screen.getByText(/claude chat/i);
  expect(heading).toBeInTheDocument();
});
