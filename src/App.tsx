import React, { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import './App.css';
import { getPromptForFormat, type FormatType, type LocationType } from './prompts/main';

type FormatTypeOrNull = FormatType | null;

const App: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<FormatTypeOrNull>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('latinAmerica');
  const [outputData, setOutputData] = useState<string>('');
  const [dataRetrieved, setDataRetrieved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const callClaude = async (prompt: string): Promise<string> => {
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      throw new Error('Please set your Anthropic API key in the .env file (REACT_APP_ANTHROPIC_API_KEY)');
    }

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const textBlock = message.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );
    return textBlock?.text ?? 'No response from Claude';
  };

  const handleFormatSelect = (format: FormatType): void => {
    console.log('Format selected:', format);
    setSelectedFormat(format);
    setDataRetrieved(false);
    setOutputData('');
    setError('');
  };

  const handleLocationSelect = (location: LocationType) => {
    console.log('Location selected:', location);
    setSelectedLocation(location);
    setDataRetrieved(false);
    setOutputData('');
    setError('');
  };

  const handleGetData = async () => {
    console.log('Get Data clicked!');
    console.log('Selected format:', selectedFormat);
    console.log('Selected location:', selectedLocation);
    
    if (!selectedFormat) {
      console.log('No format selected, returning');
      return;
    }

    const format = selectedFormat;
    setIsLoading(true);
    setError('');
    
    try {
      const prompt = getPromptForFormat(format, selectedLocation);
      
      const result = await callClaude(prompt);
      
      setOutputData(result);
      setDataRetrieved(true);
    } catch (err) {
      console.error('Error in handleGetData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDataRetrieved(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!dataRetrieved || !outputData) return;

    let filename = '';
    let mimeType = '';

    switch (selectedFormat) {
      case 'nested':
        filename = 'highest_peaks.txt';
        mimeType = 'text/plain';
        break;
      case 'json':
        filename = 'highest_peaks.json';
        mimeType = 'application/json';
        break;
      case 'yaml':
        filename = 'highest_peaks.yml';
        mimeType = 'text/yaml';
        break;
    }

    const blob = new Blob([outputData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Highest Peaks Data</h1>
        <p>Get formatted mountain peaks data in the necessary format</p>
      </header>
      
      <main className="App-main">
        <div className="section location-section">
          <h2>Select Location</h2>
          <div className="location-buttons">
            <button
              className={`btn btn-secondary location-btn ${selectedLocation === 'mexico' ? 'active' : ''}`}
              onClick={() => handleLocationSelect('mexico')}
            >
              Mexico
            </button>
            <button
              className={`btn btn-secondary location-btn ${selectedLocation === 'latinAmerica' ? 'active' : ''}`}
              onClick={() => handleLocationSelect('latinAmerica')}
            >
              Latin America
            </button>
            <button
              className={`btn btn-secondary location-btn ${selectedLocation === 'world' ? 'active' : ''}`}
              onClick={() => handleLocationSelect('world')}
            >
              World
            </button>
          </div>
        </div>

        <div className="section format-section">
          <h2>Select Output Format</h2>
          <div className="format-buttons">
            <button
              className={`btn btn-secondary format-btn ${selectedFormat === 'nested' ? 'active' : ''}`}
              onClick={() => handleFormatSelect('nested')}
            >
              Nested Text Data
            </button>
            <button
              className={`btn btn-secondary format-btn ${selectedFormat === 'json' ? 'active' : ''}`}
              onClick={() => handleFormatSelect('json')}
            >
              JSON
            </button>
            <button
              className={`btn btn-secondary format-btn ${selectedFormat === 'yaml' ? 'active' : ''}`}
              onClick={() => handleFormatSelect('yaml')}
            >
              YAML
            </button>
          </div>
        </div>

        <div className="action-section">
          <button
            className="btn btn-primary get-data-btn"
            onClick={handleGetData}
            disabled={!selectedFormat || isLoading}
          >
            {isLoading ? 'Getting Data...' : 'Get Data'}
          </button>
          
          <button
            className="btn btn-success download-btn"
            onClick={handleDownload}
            disabled={!dataRetrieved}
          >
            Download Data
          </button>
        </div>

        {error && (
          <div className="error-section">
            <h3>Error</h3>
            <p className="error-message">{error}</p>
          </div>
        )}

        <div className="section output-section">
          <h2>Output</h2>
          <textarea
            className="output-textbox"
            value={outputData}
            readOnly
            placeholder={isLoading ? "Loading data from Claude..." : "Select a location, format and click 'Get Data' to see the formatted output..."}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
