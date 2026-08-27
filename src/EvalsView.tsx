import React, { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';

export const EVALS_VERSION = '1.1.0';
import { eval_data, type EvalItem } from './prompts/evals_test';
import { system_prompt } from './prompts/main';

type EvalStatus = 'idle' | 'loading' | 'done' | 'error';

interface EvalResult {
  item: EvalItem;
  response: string;
  status: EvalStatus;
  grade: boolean | null;
}

export const extractTag = (text: string, tag: string): string => {
  const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : '';
};

export const normalizeAnswer = (text: string): string => {
  return text
    .replace(/```[\w]*\n?/g, '')
    .replace(/`/g, '')
    .trim()
    .toLowerCase();
};

export const gradeCompletion = (output: string, goldenAnswer: string): boolean => {
  const answer = extractTag(output, 'answer');
  const textToGrade = answer || output;
  return normalizeAnswer(textToGrade) === normalizeAnswer(goldenAnswer);
};

const callClaude = async (userPrompt: string): Promise<string> => {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    throw new Error('Please set your Anthropic API key in the .env file (REACT_APP_ANTHROPIC_API_KEY)');
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2000,
    system: system_prompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0,
  });

  const textBlock = message.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  );
  return textBlock?.text ?? 'No response from Claude';
};

const EvalsView: React.FC = () => {
  const [results, setResults] = useState<EvalResult[]>(
    eval_data.map((item) => ({ item, response: '', status: 'idle', grade: null }))
  );
  const [isRunning, setIsRunning] = useState(false);

  const runEvals = async () => {
    setIsRunning(true);
    setResults(eval_data.map((item) => ({ item, response: '', status: 'loading', grade: null })));

    const updated: EvalResult[] = eval_data.map((item) => ({
      item,
      response: '',
      status: 'loading' as EvalStatus,
      grade: null,
    }));

    await Promise.all(
      eval_data.map(async (item, index) => {
        try {
          const response = await callClaude(item.prompt);
          const grade = item.golden_answer ? gradeCompletion(response, item.golden_answer) : null;
          updated[index] = { item, response, status: 'done', grade };
        } catch (err) {
          updated[index] = {
            item,
            response: err instanceof Error ? err.message : 'Error',
            status: 'error',
            grade: null,
          };
        }
        setResults([...updated]);
      })
    );

    setIsRunning(false);
  };

  const doneCount = results.filter((r) => r.status === 'done' || r.status === 'error').length;
  const total = results.length;

  const gradedResults = results.filter((r) => r.grade !== null);
  const score =
    gradedResults.length > 0
      ? (gradedResults.filter((r) => r.grade === true).length / gradedResults.length) * 100
      : null;

  const hasRun = results.some((r) => r.status === 'done' || r.status === 'error');

  return (
    <div className="evals-view">
      <div className="evals-header">
        <div className="evals-header-info">
          <h2>Evals</h2>
          <span className="evals-count">{total} prompts</span>
          {isRunning && (
            <span className="evals-progress">
              {doneCount} / {total} complete
            </span>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={runEvals}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run All Evals'}
        </button>
      </div>

      {hasRun && !isRunning && score !== null && (
        <div className="evals-score-bar">
          <span className="score-label">Score</span>
          <div className="score-track">
            <div className="score-fill" style={{ width: `${score}%` }} />
          </div>
          <span className="score-value">{score.toFixed(2)}%</span>
          <span className="score-detail">
            {gradedResults.filter((r) => r.grade).length} / {gradedResults.length} graded correct
          </span>
        </div>
      )}

      <div className="evals-table-wrapper">
        <table className="evals-table">
          <thead>
            <tr>
              <th className="col-prompt">Prompt</th>
              <th className="col-response">Response</th>
              <th className="col-answer">Answer</th>
              <th className="col-golden">Golden Answer</th>
              <th className="col-grade">Grade</th>
              <th className="col-label">Label</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={`eval-row status-${result.status}`}>
                <td className="col-prompt">
                  <pre className="cell-content">{result.item.prompt}</pre>
                </td>
                <td className="col-response">
                  {result.status === 'loading' ? (
                    <span className="loading-text">Loading...</span>
                  ) : result.status === 'error' ? (
                    <span className="error-text">{result.response}</span>
                  ) : (
                    <pre className="cell-content">{extractTag(result.response, 'thinking') || result.response || '—'}</pre>
                  )}
                </td>
                <td className="col-answer">
                  {result.status === 'loading' ? (
                    <span className="loading-text">Loading...</span>
                  ) : result.status === 'error' ? null : (
                    <pre className="cell-content">{extractTag(result.response, 'answer') || '—'}</pre>
                  )}
                </td>
                <td className="col-golden">
                  <pre className="cell-content">
                    {result.item.golden_answer || <span className="empty-text">—</span>}
                  </pre>
                </td>
                <td className="col-grade">
                  {result.grade === true && <span className="grade-pass">✓</span>}
                  {result.grade === false && <span className="grade-fail">✗</span>}
                  {result.grade === null && result.status !== 'idle' && (
                    <span className="grade-na">—</span>
                  )}
                </td>
                <td className="col-label">
                  <span className={`label-badge label-${result.item.label}`}>
                    {result.item.label === 'mountain_related' ? 'mountain' : 'non-related'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvalsView;
