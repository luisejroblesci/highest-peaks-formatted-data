export type Label = 'mountain_related' | 'non_related';

export interface EvalItem {
  prompt: string;
  golden_answer: string;
  label: Label;
}

export const eval_data: EvalItem[] = [
  // mountain_related - prompts about highest peaks in various countries
  { prompt: 'List the 5 highest peaks in Mexico with name, altitude, and location in JSON format', golden_answer:`[
  {
    "name": "Pico de Orizaba (Citlaltépetl)",
    "altitude": 5636,
    "location": "Puebla / Veracruz"
  },
  {
    "name": "Popocatépetl",
    "altitude": 5426,
    "location": "Puebla / Estado de México / Morelos"
  },
  {
    "name": "Iztaccíhuatl",
    "altitude": 5230,
    "location": "Puebla / Estado de México"
  },
  {
    "name": "Nevado de Toluca (Xinantécatl)",
    "altitude": 4680,
    "location": "Estado de México"
  },
  {
    "name": "Sierra Negra (Tliltépetl)",
    "altitude": 4580,
    "location": "Puebla"
  }
]`, label: 'mountain_related' },
  { prompt: 'What are the 10 highest mountains in Peru? Include elevation in meters.', golden_answer:`[
  {
    "name": "Huascarán Sur",
    "elevation_meters": 6768
  },
  {
    "name": "Yerupajá",
    "elevation_meters": 6634
  },
  {
    "name": "Coropuna",
    "elevation_meters": 6425
  },
  {
    "name": "Huandoy",
    "elevation_meters": 6395
  },
  {
    "name": "Ausangate",
    "elevation_meters": 6384
  },
  {
    "name": "Huantsan",
    "elevation_meters": 6369
  },
  {
    "name": "Siula Grande",
    "elevation_meters": 6344
  },
  {
    "name": "Chopicalqui",
    "elevation_meters": 6354
  },
  {
    "name": "Salc` ,label: 'mountain_related' },
  { prompt: 'Give me the top 5 peaks in Ecuador as YAML with name, altitude, and province', golden_answer:`- name: Chimborazo
    altitude: 6263
    province: Chimborazo
  - name: Cotopaxi
    altitude: 5897
    province: Cotopaxi
  - name: Cayambe
    altitude: 5790
    province: Pichincha
  - name: Antisana
    altitude: 5758
    province: Pichincha
  - name: El Altar (Capac Urcu)
    altitude: 5320
    province: Chimborazo`, label: 'mountain_related' },
  { prompt: 'Highest peaks in Colombia with coordinates and elevation', golden_answer:``, label: 'mountain_related' },
  { prompt: 'List the 7 tallest mountains in Argentina, format as nested text', golden_answer:`1. Aconcagua
   - Elevation: 6,960 m
   - Location: Mendoza
   - Range: Andes

2. Ojos del Salado
   - Elevation: 6,893 m
   - Location: Catamarca (border with Chile)
   - Range: Andes

3. Monte Pissis
   - Elevation: 6,795 m
   - Location: La Rioja / Catamarca
   - Range: Andes

4. Cerro Bonete Chico
   - Elevation: 6,759 m
   - Location: La Rioja
   - Range: Andes

5. Llullaillaco
   - Elevation: 6,739 m
   - Location: Salta (border with Chile)
   - Range: Andes

6. Cerro Mercedario
   - Elevation: 6,720 m
   - Location: San Juan
   - Range: Andes

7. Cerro Tres Cruces
   - Elevation: 6,749 m
   - Location: Catamarca (border with Chile)
   - Range: Andes`, label: 'mountain_related' },
  { prompt: '5 highest peaks in Chile with altitude in meters above sea level', golden_answer:`[
  {
    "name": "Ojos del Salado",
    "altitude_masl": 6893
  },
  {
    "name": "Llullaillaco",
    "altitude_masl": 6739
  },
  {
    "name": "Tres Cruces",
    "altitude_masl": 6749
  },
  {
    "name": "Incahuasi",
    "altitude_masl": 6621
  },
  {
    "name": "Tupungato",
    "altitude_masl": 6570
  }
]`, label: 'mountain_related' },
  { prompt: 'Top 10 mountains in Nepal - name, height, and region in JSON', golden_answer:`[
  {
    "name": "Mount Everest (Sagarmatha)",
    "height": 8849,
    "region": "Solukhumbu"
  },
  {
    "name": "Kangchenjunga",
    "height": 8586,
    "region": "Taplejung"
  },
  {
    "name": "Lhotse",
    "height": 8516,
    "region": "Solukhumbu"
  },
  {
    "name": "Makalu",
    "height": 8485,
    "region": "Sankhuwasabha"
  },
  {
    "name": "Cho Oyu",
    "height": 8188,
    "region": "Solukhumbu"
  },
  {
    "name": "Dhaulagiri I",
    "height": 8167,
    "region": "M`, label: 'mountain_related' },
  { prompt: 'What are the highest peaks in Japan? Include elevation and prefecture.', golden_answer:`[
  {
    "name": "Mount Fuji (富士山)",
    "elevation": 3776,
    "prefecture": "Shizuoka / Yamanashi"
  },
  {
    "name": "Kita-dake (北岳)",
    "elevation": 3193,
    "prefecture": "Yamanashi"
  },
  {
    "name": "Oku-Hotaka-dake (奥穂高岳)",
    "elevation": 3190,
    "prefecture": "Nagano / Gifu"
  },
  {
    "name": "Ai-no-dake (間ノ岳)",
    "elevation": 3190,
    "prefecture": "Yamanashi / Shizuoka"
  },
  {
    "name": "Yari-ga-take (槍ヶ岳)",
    "elevation": 3180,
    "prefecture": "Nagano / Gifu"
  },
  {
    "name": "Higashi-dake (東岳 / 悪沢岳)",
    "elevation": 3141,
    "prefecture": "Shizuoka`, label: 'mountain_related' },
  { prompt: 'List the tallest mountains in the United States as a table', golden_answer:`| Rank | Name | Elevation (m) | State |
|------|------|---------------|-------|
| 1 | Denali (Mt. McKinley) | 6,190 | Alaska |
| 2 | Mount Saint Elias | 5,489 | Alaska |
| 3 | Mount Foraker | 5,304 | Alaska |
| 4 | Mount Bona | 5,044 | Alaska |
| 5 | Mount Blackburn | 4,996 | Alaska |
| 6 | Mount Sanford | 4,949 | Alaska |
| 7 | Mount Fairweather | 4,671 | Alaska |
| 8 | Mount Hubbard | 4,557 | Alaska |
| 9 | Mount Bear | 4,520 | Alaska |
| 10 | Mount Whitney | 4,421 | California |`, label: 'mountain_related' },
  { prompt: 'Highest peaks in Switzerland with altitude and canton in YAML format', golden_answer:`peaks:
  - name: Dufourspitze (Monte Rosa)
    altitude: 4634
    canton: Valais

  - name: Dom
    altitude: 4545
    canton: Valais

  - name: Liskamm
    altitude: 4527
    canton: Valais

  - name: Weisshorn
    altitude: 4506
    canton: Valais

  - name: Täschhorn
    altitude: 4491
    canton: Valais

  - name: Matterhorn (Cervino)
    altitude: 4478
    canton: Valais

  - name: Dent Blanche
    altitude: 4357
    canton: Valais

  - name: Grand Combin
    altitude: 4314
    canton: Valais

  - name: Finsteraarhorn
    altitude: 4274
    canton: Bern / Valais

  - name: Zinalrothorn
    altitude: 4221
    canton: Valais`, label: 'mountain_related' },
  { prompt: '5 highest mountains in India with name, elevation, and state', golden_answer:`[
  {
    "name": "Kangchenjunga",
    "elevation_meters": 8586,
    "state": "Sikkim"
  },
  {
    "name": "Nanda Devi",
    "elevation_meters": 7816,
    "state": "Uttarakhand"
  },
  {
    "name": "Kamet",
    "elevation_meters": 7756,
    "state": "Uttarakhand"
  },
  {
    "name": "Saltoro Kangri",
    "elevation_meters": 7742,
    "state": "Ladakh"
  },
  {
    "name": "Saser Kangri",
    "elevation_meters": 7672,
    "state": "Ladakh"
  }
]`, label: 'mountain_related' },
  { prompt: 'Top peaks in Canada - include name, height in meters, and province', golden_answer:`[
  {
    "name": "Mount Logan",
    "height_meters": 5959,
    "province": "Yukon"
  },
  {
    "name": "Mount Saint Elias",
    "height_meters": 5489,
    "province": "Yukon"
  },
  {
    "name": "Mount Lucania",
    "height_meters": 5226,
    "province": "Yukon"
  },
  {
    "name": "King Peak",
    "height_meters": 5173,
    "province": "Yukon"
  },
  {
    "name": "Mount Steele",
    "height_meters": 5073,
    "province": "Yukon"
  },
  {
    "name": "Mount Wood",
    "height_meters": 4842,
    "province": "Yukon"
  },
  {
    "name": "Mount Vancouver",
    "height_meters": 4812,
    "province": "Yukon"
  },
  {
    "name": "Mount Slaggard",
    "height_meters": 4742,
    "province": "Yukon"
  },
  {
    "name": "Mount Fairweather",
    "height_meters": 4671,
    "province": "British Columbia"
  },
  {
    "name": "Mount Hubbard",
    "height_meters": 4557,
    "province": "Yukon"
  }
]`, label: 'mountain_related' },
  // non_related - prompts unrelated to mountains
  { prompt: 'What are the best Italian restaurants in New York City?', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'Explain quantum entanglement in simple terms', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'List 5 popular programming languages and their main use cases', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'How do I make chocolate chip cookies from scratch?', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'What is the capital of Australia and its population?', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'Write a haiku about the ocean', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'List the top 10 movies of 2024 by box office sales', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'How does photosynthesis work in plants?', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'Best practices for remote work productivity', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'What are the symptoms of the common cold and how to treat it?', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'Compare the specs of iPhone 15 vs Samsung Galaxy S24', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
  { prompt: 'How to invest in index funds for beginners', golden_answer:`I'm sorry, I can only help with highest peaks.`, label: 'non_related' },
];