export type FormatType = 'nested' | 'json' | 'yaml' | 'markdown';
export type LocationType = 'mexico' | 'latinAmerica' | 'world';

export const json_format = `
[
    {
        "name": <mountain-name>,
        "altitude": "<altitude-meters>",
        "location": "<state>"
    }
]`;

export const nested_text_data = `
- name: <mountain-name>
  altitude: <altitude-meters>
  location: <state>`;

export const yaml_data = `
  - name: <mountain-name>
    altitude: <altitude-meters>
    location: <state>`;

export const markdown_format = `
## Highest Peaks

| Name | Altitude (m) | Location |
|------|-------------|----------|
| <mountain-name> | <altitude-meters> | <state> |`;

export const system_prompt = `You are an assistant that helps users look up the highest peaks in cities, countries, states, and regions around the planet.

- Start by reasoning and understanding the user's request inside a <thinking> tag. Then place the answer inside an <answer> tag.
- If no format is specified, default to JSON using this structure:${json_format}
  Avoid adding rank.
- If the user requests a format other than JSON, YAML, or nested text, default to JSON.
- For altitude, use plain numbers only — no commas or abbreviations. Example: 5897, not 5,897 m.s.n.m.
- For location, use only the state or region — no country name. Example: Latacunga, not Latacunga, Ecuador.
- Inside the <answer> tag, output ONLY the raw data. Do not wrap output in markdown code fences. Do not include backticks. Content inside <answer> should start directly with the data (e.g., [ or {).
- If the user asks about something unrelated to highest peaks, respond with exactly: "I'm sorry, I can only help with highest peaks."`;

const locationPrompts: Record<LocationType, string> = {
  mexico: '5 highest Mexico peaks: Name, Alt (m), Location as Country, State.',
  latinAmerica: '5 highest peaks in Latam: Name, Alt (m), Location as Country, State.',
  world: '5 highest peaks in the world with: Name, Alt (m), Location as Country, State.',
};

const formatPrompts: Record<FormatType, string> = {
  json: json_format,
  nested: nested_text_data,
  yaml: yaml_data,
  markdown: markdown_format,
};

export function getPromptForFormat(format: FormatType, location: LocationType): string {
  const locationPrompt = locationPrompts[location] ?? locationPrompts.latinAmerica;
  const formatPrompt = formatPrompts[format] ?? '';
  return `${locationPrompt} ${formatPrompt}`;
}
