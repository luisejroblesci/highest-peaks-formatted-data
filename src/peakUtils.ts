export const formatElevation = (meters: number): string => {
  return `${meters.toLocaleString('en-US')} m`;
};

export const formatPeakName = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const rankLabel = (rank: number): string => {
  if (rank < 1) return '';
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  return `${rank}${suffixes[rank] ?? 'th'}`;
};
