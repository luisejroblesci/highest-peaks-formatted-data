import { getPromptForFormat, system_prompt } from './main';

describe('getPromptForFormat', () => {
  const formats = ['nested', 'json', 'yaml'] as const;
  const locations = ['mexico', 'latinAmerica', 'world'] as const;

  it.each(formats.flatMap((f) => locations.map((l) => [f, l] as const)))(
    'returns a non-empty string for format=%s location=%s',
    (format, location) => {
      expect(getPromptForFormat(format, location)).toBeTruthy();
    }
  );

  it('includes "Mexico" for mexico location', () => {
    expect(getPromptForFormat('json', 'mexico')).toMatch(/mexico/i);
  });

  it('includes "Latam" or "Latin" for latinAmerica location', () => {
    expect(getPromptForFormat('json', 'latinAmerica')).toMatch(/latin|latam/i);
  });

  it('includes "world" for world location', () => {
    expect(getPromptForFormat('json', 'world')).toMatch(/world/i);
  });

  it('includes JSON structure markers for json format', () => {
    const prompt = getPromptForFormat('json', 'mexico');
    expect(prompt).toContain('"name"');
    expect(prompt).toContain('"altitude"');
  });

  it('includes YAML list marker for yaml format', () => {
    const prompt = getPromptForFormat('yaml', 'mexico');
    expect(prompt).toContain('- name:');
  });

  it('includes nested text list marker for nested format', () => {
    const prompt = getPromptForFormat('nested', 'mexico');
    expect(prompt).toContain('- name:');
  });

  it('produces different output for json vs yaml', () => {
    expect(getPromptForFormat('json', 'world')).not.toEqual(getPromptForFormat('yaml', 'world'));
  });

  it('produces different output for mexico vs world', () => {
    expect(getPromptForFormat('json', 'mexico')).not.toEqual(getPromptForFormat('json', 'world'));
  });
});

describe('system_prompt', () => {
  it('contains the fallback refusal message for off-topic prompts', () => {
    expect(system_prompt).toContain("I'm sorry, I can only help with highest peaks.");
  });

  it('instructs output inside <answer> tag', () => {
    expect(system_prompt).toContain('<answer>');
  });

  it('instructs reasoning inside <thinking> tag', () => {
    expect(system_prompt).toContain('<thinking>');
  });

  it('embeds the JSON format example directly (no unfilled placeholders)', () => {
    expect(system_prompt).not.toContain('{{');
    expect(system_prompt).toContain('"name"');
    expect(system_prompt).toContain('"altitude"');
  });

  it('instructs altitude as plain numbers', () => {
    expect(system_prompt).toMatch(/altitude.+plain number/i);
  });

  it('instructs location as state only', () => {
    expect(system_prompt).toMatch(/location.+state/i);
  });
});
