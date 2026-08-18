import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { getMonacoLanguage } from '../utils/monacoLanguage';
import { CheckIcon, CopyIcon, PlayIcon, RefreshIcon, XIcon } from './ui/Icons';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onChange?: (code: string) => void;
  showToolbar?: boolean;
  showRunButton?: boolean;
  showOutput?: boolean;
  height?: string;
  readOnly?: boolean;
}

const EXECUTOR_URL = 'https://executor.charles-bai.com/execute';

export function CodeEditor({
  initialCode,
  language,
  onChange,
  showToolbar = true,
  showRunButton = true,
  showOutput = true,
  height = '500px',
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = async () => {
    setLoading(true);
    setOutput('Running...');

    try {
      const res = await fetch(EXECUTOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setOutput('Error: You are clicking too fast! (Rate Limit)');
      } else if (res.status === 503) {
        setOutput('Error: Server is busy processing other jobs. Try again in 5s.');
      } else if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.stdout || data.stderr || 'No output returned.');
      }
    } catch (err) {
      console.error('Code execution error:', err);
      setOutput('Network Error: Could not reach execution engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value?: string) => {
    const nextCode = value || '';
    setCode(nextCode);
    onChange?.(nextCode);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    onChange?.(initialCode);
  };

  return (
    <div
      className="flex flex-col overflow-hidden border border-border bg-code-bg"
      style={{ height }}
    >
      {showToolbar && (
        <div className="flex min-h-[52px] items-center justify-between gap-3 border-b border-border bg-surface px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-error/70" />
              <span className="h-2 w-2 rounded-full bg-warning/70" />
              <span className="h-2 w-2 rounded-full bg-success/70" />
            </div>
            <span className="truncate font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-secondary">
              main.{getMonacoLanguage(language)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="button-ghost min-h-9 px-2.5"
              aria-label="Copy code"
              title="Copy code"
            >
              {copied ? (
                <CheckIcon className="h-3.5 w-3.5 text-success" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            {!readOnly && (
              <button
                type="button"
                onClick={handleReset}
                className="button-ghost min-h-9 px-2.5"
                aria-label="Reset code"
                title="Reset code"
              >
                <RefreshIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            {showRunButton && (
            <button
                type="button"
              onClick={handleRun}
              disabled={loading}
                className="button-primary min-h-9 px-3"
            >
                <PlayIcon className="h-3.5 w-3.5" />
                {loading ? 'Running' : 'Run'}
            </button>
          )}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          theme="toolbox-dark"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('toolbox-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '6F767D', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'F5B63F' },
                { token: 'string', foreground: '9BC89E' },
                { token: 'number', foreground: '7AA7FF' },
                { token: 'type', foreground: 'D7A7FF' },
              ],
              colors: {
                'editor.background': '#090B0D',
                'editor.foreground': '#D7DADC',
                'editorLineNumber.foreground': '#3F454B',
                'editorLineNumber.activeForeground': '#A8ADB2',
                'editor.selectionBackground': '#3B2D14',
                'editor.inactiveSelectionBackground': '#242018',
                'editorCursor.foreground': '#F5B63F',
                'editor.lineHighlightBackground': '#101316',
                'editorIndentGuide.background1': '#20252A',
                'editorIndentGuide.activeBackground1': '#41484F',
              },
            });
          }}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'IBM Plex Mono', Consolas, monospace",
            fontLigatures: true,
            lineHeight: 22,
            padding: { top: 18, bottom: 18 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly,
            renderLineHighlight: 'line',
            smoothScrolling: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      {showOutput && (
        <div className="flex h-36 shrink-0 flex-col border-t border-border bg-black">
          <div className="flex min-h-9 items-center justify-between border-b border-border bg-surface px-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading ? 'bg-warning' : output ? 'bg-success' : 'bg-text-tertiary'
                }`}
              />
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-text-tertiary">
                Console / stdout
              </span>
            </div>
            {output && !loading && (
              <button
                type="button"
                onClick={() => setOutput('')}
                className="text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="Clear console"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <pre
            className="m-0 flex-1 overflow-auto whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-5 text-code-text"
            aria-live="polite"
          >
            {output || (
              <span className="text-text-tertiary">
                Ready. Execute the current buffer to inspect its output.
              </span>
            )}
          </pre>
        </div>
      )}
    </div>
  );
}