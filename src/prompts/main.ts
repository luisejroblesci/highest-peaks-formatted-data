export type FormatType = 'nested' | 'json' | 'yaml';
export type LocationType = 'mexico' | 'latinAmerica' | 'world';

export const main_prompt = `
You're an assistant that goes and looks up the highest peaks in whatever city, country, state, region available on the planet.
What the user is asking is: {{user_prompt}}
- Start by reasoning and understanding the user's request and add it inside <thinking> tag. Then the answer should be inside <answer> tag.
- If no format is specified, the format should be JSON. Strictly follow the format: {{json_format}}. Avoid adding rank
- If user mentions mention other format outside of JSON, YAML, nested text. Default to JSON format.
- For altitude, only plain number, no commas or abbreviations. Example: 5897, not 5,897 m.s.n.m.
- For location, only state. No country. Example: Latacunga not Latacunga, Ecuador.
- Inside the <answer> tag, output ONLY the raw data. Do not wrap the output in markdown code fences (\`\`\` or \`\`\`json). Do not include any backticks. The content inside <answer> should start directly with the data (e.g., start with [ or {).
If user asks something non related to highest peaks, respond with "I'm sorry, I can only help with highest peaks."
`;

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

const locationPrompts: Record<LocationType, string> = {
  mexico: '5 highest Mexico peaks: Name, Alt (m), Location as Country, State.',
  latinAmerica: '5 highest peaks in Latam: Name, Alt (m), Location as Country, State.',
  world: '5 highest peaks in the world with: Name, Alt (m), Location as Country, State.',
};

const formatPrompts: Record<FormatType, string> = {
  json: json_format,
  nested: nested_text_data,
  yaml: yaml_data,
};

export function getPromptForFormat(format: FormatType, location: LocationType): string {
  const locationPrompt = locationPrompts[location] ?? locationPrompts.latinAmerica;
  const formatPrompt = formatPrompts[format] ?? '';
  return `${locationPrompt} ${formatPrompt}`;
}
