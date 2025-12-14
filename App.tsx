import React, { useState } from 'react';
import { parseRepoUrl, fetchRepoData } from './services/githubService';
import { analyzeRepository } from './services/geminiService';
import { RepoMetadata, AnalysisResult } from './types';
import ResultsView from './components/ResultsView';
import { Github, Search, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ metadata: RepoMetadata; analysis: AnalysisResult } | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const repoInfo = parseRepoUrl(url);
      if (!repoInfo) {
        throw new Error("Invalid GitHub URL. Format: https://github.com/owner/repo");
      }

      // 1. Fetch data from GitHub
      const repoContext = await fetchRepoData(repoInfo.owner, repoInfo.name);

      // 2. Send to Gemini for analysis
      const analysis = await analyzeRepository(repoContext);

      setData({ metadata: repoContext.metadata, analysis });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              <Github size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              GitGrade
            </span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            AI-Powered Repository Analysis
          </div>
        </div>
      </nav>

      {/* Hero / Input Section */}
      <main className="flex-grow flex flex-col">
        {!data && (
          <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Evaluate your code with <br className="hidden sm:block" />
                <span className="text-indigo-600">AI Precision</span>
              </h1>
              <p className="text-lg text-slate-600">
                Get an instant score, summary, and personalized roadmap for any public GitHub repository. Improve your skills and impress recruiters.
              </p>

              <div className="w-full max-w-xl mx-auto mt-8 relative">
                 <form onSubmit={handleAnalyze} className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Github className="h-5 w-5 text-slate-400" />
                   </div>
                   <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg text-lg transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Analyze'}
                  </button>
                 </form>
                 
                 {error && (
                   <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-2 text-sm text-left">
                     <span className="font-bold">Error:</span> {error}
                   </div>
                 )}
              </div>

              <div className="pt-8">
                <p className="text-sm text-slate-400 mb-3 uppercase tracking-wide font-semibold">Try an example</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => handleExampleClick('https://github.com/facebook/react')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">facebook/react</button>
                  <button onClick={() => handleExampleClick('https://github.com/airbnb/javascript')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">airbnb/javascript</button>
                  <button onClick={() => handleExampleClick('https://github.com/tailwindlabs/tailwindcss')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">tailwindlabs/tailwindcss</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div className="bg-slate-50 py-12">
            <div className="max-w-5xl mx-auto px-4 mb-6">
                <button 
                  onClick={() => setData(null)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                >
                  ← Analyze another repository
                </button>
            </div>
            <ResultsView analysis={data.analysis} metadata={data.metadata} />
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 GitGrade AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
