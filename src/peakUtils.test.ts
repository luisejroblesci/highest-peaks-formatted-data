import { formatElevation, formatPeakName, rankLabel } from './peakUtils';

describe('formatElevation', () => {
  it('formats a round number with the m suffix', () => {
    expect(formatElevation(8849)).toBe('8,849 m');
  });

  it('formats a four-digit elevation without thousands separator gap', () => {
    expect(formatElevation(5642)).toBe('5,642 m');
  });

  it('formats zero elevation', () => {
    expect(formatElevation(0)).toBe('0 m');
  });
});

describe('formatPeakName', () => {
  it('title-cases a lowercase name', () => {
    expect(formatPeakName('mount everest')).toBe('Mount Everest');
  });

  it('lowercases an all-caps name then title-cases it', () => {
    expect(formatPeakName('K2')).toBe('K2');
  });

  it('trims leading and trailing whitespace', () => {
    expect(formatPeakName('  aconcagua  ')).toBe('Aconcagua');
  });

  it('handles a single-word name', () => {
    expect(formatPeakName('kilimanjaro')).toBe('Kilimanjaro');
  });
});

describe('rankLabel', () => {
  it('returns 1st for rank 1', () => {
    expect(rankLabel(1)).toBe('1st');
  });

  it('returns 2nd for rank 2', () => {
    expect(rankLabel(2)).toBe('2nd');
  });

  it('returns 4th for rank 4', () => {
    expect(rankLabel(4)).toBe('4th');
  });
});
