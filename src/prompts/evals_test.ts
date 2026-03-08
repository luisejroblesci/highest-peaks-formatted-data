type GoldenAnswer = 'mountain_related' | 'non_related';

interface EvalItem {
  prompt: string;
  golden_answer: GoldenAnswer;
}

const eval_data: EvalItem[] = [
  // mountain_related - prompts about highest peaks in various countries
  { prompt: 'List the 5 highest peaks in Mexico with name, altitude, and location in JSON format', golden_answer: 'mountain_related' },
  { prompt: 'What are the 10 highest mountains in Peru? Include elevation in meters.', golden_answer: 'mountain_related' },
  { prompt: 'Give me the top 5 peaks in Ecuador as YAML with name, altitude, and province', golden_answer: 'mountain_related' },
  { prompt: 'Highest peaks in Colombia with coordinates and elevation', golden_answer: 'mountain_related' },
  { prompt: 'List the 7 tallest mountains in Argentina, format as nested text', golden_answer: 'mountain_related' },
  { prompt: '5 highest peaks in Chile with altitude in meters above sea level', golden_answer: 'mountain_related' },
  { prompt: 'Top 10 mountains in Nepal - name, height, and region in JSON', golden_answer: 'mountain_related' },
  { prompt: 'What are the highest peaks in Japan? Include elevation and prefecture', golden_answer: 'mountain_related' },
  { prompt: 'List the tallest mountains in the United States as a table', golden_answer: 'mountain_related' },
  { prompt: 'Highest peaks in Switzerland with altitude and canton in YAML format', golden_answer: 'mountain_related' },
  { prompt: '5 highest mountains in India with name, elevation, and state', golden_answer: 'mountain_related' },
  { prompt: 'Top peaks in Canada - include name, height in meters, and province', golden_answer: 'mountain_related' },
  // non_related - prompts unrelated to mountains
  { prompt: 'What are the best Italian restaurants in New York City?', golden_answer: 'non_related' },
  { prompt: 'Explain quantum entanglement in simple terms', golden_answer: 'non_related' },
  { prompt: 'List 5 popular programming languages and their main use cases', golden_answer: 'non_related' },
  { prompt: 'How do I make chocolate chip cookies from scratch?', golden_answer: 'non_related' },
  { prompt: 'What is the capital of Australia and its population?', golden_answer: 'non_related' },
  { prompt: 'Write a haiku about the ocean', golden_answer: 'non_related' },
  { prompt: 'List the top 10 movies of 2024 by box office sales', golden_answer: 'non_related' },
  { prompt: 'How does photosynthesis work in plants?', golden_answer: 'non_related' },
  { prompt: 'Best practices for remote work productivity', golden_answer: 'non_related' },
  { prompt: 'What are the symptoms of the common cold and how to treat it?', golden_answer: 'non_related' },
  { prompt: 'Compare the specs of iPhone 15 vs Samsung Galaxy S24', golden_answer: 'non_related' },
  { prompt: 'How to invest in index funds for beginners', golden_answer: 'non_related' },
];