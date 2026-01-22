import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { getMonacoLanguage } from '../utils/monacoLanguage';

interface CodeEditorProps {
  initialCode: string;
  language: string;
}

const EXECUTOR_URL = 'https://executor.charles-bai.com/execute';

export function CodeEditor({ initialCode, language }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex flex-col h-[500px] border border-[#374151] rounded-md bg-code-bg overflow-hidden">
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#252526] border-b border-[#374151]">
        <span className="text-[#9ca3af] text-xs font-mono uppercase tracking-[0.05em]">
          {language}
        </span>
        <button 
          onClick={handleRun} 
          disabled={loading}
          className="px-4 py-1.5 rounded text-sm font-medium border-none cursor-pointer transition-colors duration-200 bg-[#15803d] text-white hover:bg-[#16a34a] disabled:bg-[#4b5563] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Executing...' : 'Run Code'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor 
          height="100%" 
          defaultLanguage={getMonacoLanguage(language)} 
          value={code} 
          theme="vs-dark"
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Console Output */}
      <div className="h-32 bg-black border-t border-[#374151] flex flex-col">
        <div className="px-4 py-1 bg-[#1e1e1e] text-xs text-[#6b7280] font-mono border-b border-[#1f2937]">
          TERMINAL
        </div>
        <pre className="flex-1 px-4 py-4 text-[#d1d5db] font-mono text-sm overflow-auto whitespace-pre-wrap">
          {output || <span className="text-[#4b5563] italic">Output will appear here...</span>}
        </pre>
      </div>
    </div>
  );
}