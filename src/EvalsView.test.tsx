import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { extractTag, gradeCompletion } from './EvalsView';
import EvalsView from './EvalsView';
import { eval_data } from './prompts/evals_test';

jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: '<thinking>thought</thinking><answer>42</answer>' }],
      }),
    },
  })),
}));

describe('extractTag', () => {
  it('extracts content from a matching tag', () => {
    expect(extractTag('<answer>hello</answer>', 'answer')).toBe('hello');
  });

  it('trims whitespace from extracted content', () => {
    expect(extractTag('<answer>  hello  </answer>', 'answer')).toBe('hello');
  });

  it('returns empty string when tag is absent', () => {
    expect(extractTag('no tags here', 'answer')).toBe('');
  });

  it('handles multi-line content inside tag', () => {
    const text = '<answer>\nline1\nline2\n</answer>';
    expect(extractTag(text, 'answer')).toBe('line1\nline2');
  });

  it('extracts thinking tag independently of answer tag', () => {
    const text = '<thinking>step 1</thinking><answer>result</answer>';
    expect(extractTag(text, 'thinking')).toBe('step 1');
    expect(extractTag(text, 'answer')).toBe('result');
  });

  it('returns empty string for empty tag content', () => {
    expect(extractTag('<answer></answer>', 'answer')).toBe('');
  });
});

describe('gradeCompletion', () => {
  it('returns true when answer tag matches golden answer exactly', () => {
    const output = '<thinking>thought</thinking><answer>correct</answer>';
    expect(gradeCompletion(output, 'correct')).toBe(true);
  });

  it('returns false when answer tag does not match', () => {
    const output = '<answer>wrong</answer>';
    expect(gradeCompletion(output, 'correct')).toBe(false);
  });

  it('ignores surrounding whitespace in comparison', () => {
    const output = '<answer>  correct  </answer>';
    expect(gradeCompletion(output, 'correct')).toBe(true);
  });

  it('falls back to raw output when no answer tag is present', () => {
    expect(gradeCompletion('correct', 'correct')).toBe(true);
    expect(gradeCompletion('wrong', 'correct')).toBe(false);
  });

  it('matches case-insensitively when answer tag differs in case', () => {
    const output = '<answer>CORRECT</answer>';
    expect(gradeCompletion(output, 'correct')).toBe(true);
  });

  it('matches case-insensitively for raw output fallback', () => {
    expect(gradeCompletion('Correct', 'correct')).toBe(true);
  });

  it('still returns false for a genuine mismatch regardless of case', () => {
    expect(gradeCompletion('<answer>wrong</answer>', 'CORRECT')).toBe(false);
  });
});

describe('eval_data', () => {
  it('contains at least one mountain_related item', () => {
    expect(eval_data.some((item) => item.label === 'mountain_related')).toBe(true);
  });

  it('contains at least one non_related item', () => {
    expect(eval_data.some((item) => item.label === 'non_related')).toBe(true);
  });

  it('every item has a non-empty prompt', () => {
    eval_data.forEach((item) => {
      expect(item.prompt.trim().length).toBeGreaterThan(0);
    });
  });

  it('every item has a valid label', () => {
    const validLabels = new Set(['mountain_related', 'non_related']);
    eval_data.forEach((item) => {
      expect(validLabels.has(item.label)).toBe(true);
    });
  });

  it('non_related items have a golden_answer refusal message', () => {
    eval_data
      .filter((item) => item.label === 'non_related')
      .forEach((item) => {
        expect(item.golden_answer).toMatch(/I'm sorry/i);
      });
  });
});

describe('EvalsView component', () => {
  it('renders the eval count', () => {
    render(<EvalsView />);
    expect(screen.getByText(`${eval_data.length} prompts`)).toBeInTheDocument();
  });

  it('renders Run All Evals button', () => {
    render(<EvalsView />);
    expect(screen.getByRole('button', { name: /run all evals/i })).toBeInTheDocument();
  });

  it('Run All Evals button is enabled before running', () => {
    render(<EvalsView />);
    expect(screen.getByRole('button', { name: /run all evals/i })).not.toBeDisabled();
  });

  it('renders a row for each eval item', () => {
    render(<EvalsView />);
    const rows = screen.getAllByRole('row');
    // +1 for the header row
    expect(rows.length).toBe(eval_data.length + 1);
  });
});
