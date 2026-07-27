import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'Mock response' }],
      }),
    },
  })),
}));

describe('App – initial render', () => {
  test('renders the Claude Chat heading', () => {
    render(<App />);
    expect(screen.getByText(/claude chat/i)).toBeInTheDocument();
  });

  test('shows Prompt and Evals nav buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /^prompt$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^evals$/i })).toBeInTheDocument();
  });

  test('shows Preset Options and Custom Prompt mode buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /preset options/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom prompt/i })).toBeInTheDocument();
  });
});

describe('App – view switching', () => {
  test('clicking Evals nav renders the evals view', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^evals$/i }));
    expect(screen.getByRole('button', { name: /run all evals/i })).toBeInTheDocument();
  });

  test('clicking Prompt nav restores the main view', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^evals$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^prompt$/i }));
    expect(screen.getByRole('button', { name: /preset options/i })).toBeInTheDocument();
  });
});

describe('App – preset mode', () => {
  test('submit button is disabled when no format is selected', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /get response/i })).toBeDisabled();
  });

  test('submit button is enabled after selecting JSON format', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^json$/i }));
    expect(screen.getByRole('button', { name: /get response/i })).not.toBeDisabled();
  });

  test('submit button is enabled after selecting YAML format', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^yaml$/i }));
    expect(screen.getByRole('button', { name: /get response/i })).not.toBeDisabled();
  });

  test('submit button is enabled after selecting Nested Text format', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /nested text data/i }));
    expect(screen.getByRole('button', { name: /get response/i })).not.toBeDisabled();
  });

  test('renders all three location buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /^mexico$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /latin america/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^world$/i })).toBeInTheDocument();
  });

  test('renders all three format buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /nested text data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^json$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^yaml$/i })).toBeInTheDocument();
  });
});

describe('App – custom prompt mode', () => {
  const getPromptTextarea = () =>
    screen.getByPlaceholderText(/list the 5 highest peaks/i);

  test('switching to custom mode shows the prompt textarea', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }));
    expect(getPromptTextarea()).toBeInTheDocument();
  });

  test('submit button is disabled when custom prompt is empty', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }));
    expect(screen.getByRole('button', { name: /get response/i })).toBeDisabled();
  });

  test('submit button is enabled when custom prompt has text', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }));
    fireEvent.change(getPromptTextarea(), { target: { value: 'List peaks in Mexico' } });
    expect(screen.getByRole('button', { name: /get response/i })).not.toBeDisabled();
  });

  test('submit button disabled again when custom prompt is cleared', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }));
    const textarea = getPromptTextarea();
    fireEvent.change(textarea, { target: { value: 'some prompt' } });
    fireEvent.change(textarea, { target: { value: '' } });
    expect(screen.getByRole('button', { name: /get response/i })).toBeDisabled();
  });
});

describe('App – download button', () => {
  test('download button is disabled when there is no output', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /download response/i })).toBeDisabled();
  });
});

describe('App – clear output button', () => {
  test('clear button is present in the main view', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /clear output/i })).toBeInTheDocument();
  });

  test('clear button is disabled when there is no output', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /clear output/i })).toBeDisabled();
  });
});
