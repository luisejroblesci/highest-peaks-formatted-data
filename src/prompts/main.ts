export type FormatType = 'nested' | 'json' | 'yaml';
export type LocationType = 'mexico' | 'latinAmerica' | 'world';

export const main_prompt = `Give the the list of the 20 highest peaks in Mexico. Name, Altitude as " 5000 m.s.n.m" (meters above sea level), and Location as "State, Country".`;
export const json_format = `as the following json format: 
### Example:
[
    {
        "name": "Cotopaxi",
        "altitude": "5897 m.s.n.m",
        "location": "Latacunga, Ecuador"
    }
]`;
export const nested_text_data = `as the following nested text data format: 
### Example:
- name: Cotopaxi
  altitude: 5897 m.s.n.m
  location: Latacunga, Ecuador`;

export const yaml_data = `as the following nested text data format: 
  ### Example:
  - name: Cotopaxi
    altitude: 5897 m.s.n.m
    location: Latacunga, Ecuador`;

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
