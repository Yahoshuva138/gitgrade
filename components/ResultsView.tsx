import React from 'react';
import { AnalysisResult, RepoMetadata } from '../types';
import ScoreChart from './ScoreChart';
import { CheckCircle2, AlertCircle, BookOpen, GitBranch, Terminal, ExternalLink, Award } from 'lucide-react';

interface ResultsViewProps {
  analysis: AnalysisResult;
  metadata: RepoMetadata;
}

const ResultsView: React.FC<ResultsViewProps> = ({ analysis, metadata }) => {
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            {metadata.owner} / {metadata.name}
            <a 
              href={`https://github.com/${metadata.owner}/${metadata.name}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">{metadata.description || "No description available."}</p>
          <div className="flex gap-4 mt-4 text-sm text-slate-600">
            <span className="flex items-center gap-1"><Award size={16} /> {metadata.stars} Stars</span>
            <span className="flex items-center gap-1"><GitBranch size={16} /> {metadata.forks} Forks</span>
            <span className="flex items-center gap-1"><Terminal size={16} /> {metadata.language || 'Multi-language'}</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border font-medium ${getLevelColor(analysis.level)}`}>
          {analysis.level} Developer
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Score & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">GitGrade Score</h3>
            <ScoreChart score={analysis.score} />
            <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center text-xs">
               <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                 <span className="font-bold text-slate-700">{analysis.documentationScore}</span>
                 <span className="text-slate-400">Docs</span>
               </div>
               <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                 <span className="font-bold text-slate-700">{analysis.consistencyScore}</span>
                 <span className="text-slate-400">Activity</span>
               </div>
               <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                 <span className="font-bold text-slate-700">{analysis.bestPracticesScore}</span>
                 <span className="text-slate-400">Clean Code</span>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" />
              Summary
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {analysis.summary}
            </p>
          </div>
        </div>

        {/* Right Column: Roadmap & Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Roadmap */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
               <GitBranch size={20} className="text-indigo-500" />
               Personalized Roadmap
            </h3>
            <div className="space-y-0 relative">
              <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-200"></div>
              {analysis.roadmap.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 mb-6 last:mb-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold z-10 border-2 border-white shadow-sm text-sm">
                    {idx + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-slate-700 font-medium">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50/50 rounded-xl border border-green-100 p-6">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} /> Strengths
              </h4>
              <ul className="space-y-3">
                {analysis.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-orange-50/50 rounded-xl border border-orange-100 p-6">
              <h4 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <AlertCircle size={18} /> Areas for Improvement
              </h4>
               <ul className="space-y-3">
                {analysis.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultsView;
