import React, { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import './App.css';
import { getPromptForFormat, type FormatType, type LocationType } from './prompts/main';

type PromptMode = 'preset' | 'custom';
type FormatTypeOrNull = FormatType | null;

const App: React.FC = () => {
  const [promptMode, setPromptMode] = useState<PromptMode>('preset');
  const [selectedFormat, setSelectedFormat] = useState<FormatTypeOrNull>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('latinAmerica');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [outputData, setOutputData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const callClaude = async (userPrompt: string): Promise<string> => {
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      throw new Error('Please set your Anthropic API key in the .env file (REACT_APP_ANTHROPIC_API_KEY)');
    }

    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    });

    const textBlock = message.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );
    return textBlock?.text ?? 'No response from Claude';
  };

  const handleSubmit = async () => {
    const prompt =
      promptMode === 'custom'
        ? customPrompt.trim()
        : selectedFormat
          ? getPromptForFormat(selectedFormat, selectedLocation)
          : '';

    if (!prompt) return;

    setIsLoading(true);
    setError('');
    setOutputData('');

    try {
      const result = await callClaude(prompt);
      setOutputData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit =
    promptMode === 'custom'
      ? customPrompt.trim().length > 0
      : selectedFormat !== null;

  const handleDownload = () => {
    if (!outputData) return;

    let filename = 'response.txt';
    let mimeType = 'text/plain';
    if (promptMode === 'preset' && selectedFormat) {
      switch (selectedFormat) {
        case 'nested':
          filename = 'highest_peaks.txt';
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
        <h1>Claude Chat</h1>
        <p>Use presets or enter your own prompt</p>
      </header>

      <main className="App-main">
        <div className="section mode-section">
          <h2>Prompt Mode</h2>
          <div className="mode-buttons">
            <button
              className={`btn btn-secondary mode-btn ${promptMode === 'preset' ? 'active' : ''}`}
              onClick={() => setPromptMode('preset')}
            >
              Preset Options
            </button>
            <button
              className={`btn btn-secondary mode-btn ${promptMode === 'custom' ? 'active' : ''}`}
              onClick={() => setPromptMode('custom')}
            >
              Custom Prompt
            </button>
          </div>
        </div>

        {promptMode === 'preset' ? (
          <>
            <div className="section location-section">
              <h2>Select Location</h2>
              <div className="location-buttons">
                <button
                  className={`btn btn-secondary location-btn ${selectedLocation === 'mexico' ? 'active' : ''}`}
                  onClick={() => setSelectedLocation('mexico')}
                >
                  Mexico
                </button>
                <button
                  className={`btn btn-secondary location-btn ${selectedLocation === 'latinAmerica' ? 'active' : ''}`}
                  onClick={() => setSelectedLocation('latinAmerica')}
                >
                  Latin America
                </button>
                <button
                  className={`btn btn-secondary location-btn ${selectedLocation === 'world' ? 'active' : ''}`}
                  onClick={() => setSelectedLocation('world')}
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
                  onClick={() => setSelectedFormat('nested')}
                >
                  Nested Text Data
                </button>
                <button
                  className={`btn btn-secondary format-btn ${selectedFormat === 'json' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('json')}
                >
                  JSON
                </button>
                <button
                  className={`btn btn-secondary format-btn ${selectedFormat === 'yaml' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('yaml')}
                >
                  YAML
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="section prompt-section">
            <h2>Your Prompt</h2>
            <textarea
              className="prompt-input"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="e.g. List the 5 highest peaks in Mexico with name, altitude, and location in JSON format"
              rows={5}
              disabled={isLoading}
            />
          </div>
        )}

        <div className="action-section">
          <button
            className="btn btn-primary submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? 'Getting Response...' : 'Get Response'}
          </button>

          <button
            className="btn btn-success download-btn"
            onClick={handleDownload}
            disabled={!outputData}
          >
            Download Response
          </button>
        </div>

        {error && (
          <div className="error-section">
            <h3>Error</h3>
            <p className="error-message">{error}</p>
          </div>
        )}

        <div className="section output-section">
          <h2>Response</h2>
          <textarea
            className="output-textbox"
            value={outputData}
            readOnly
            placeholder={isLoading ? 'Loading response from Claude...' : "Select options or enter a prompt, then click 'Get Response'..."}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
