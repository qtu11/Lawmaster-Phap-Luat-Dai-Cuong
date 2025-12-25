import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CheckCircle, XCircle, RefreshCcw, Home } from 'lucide-react';
import { Question } from '../types';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  answers: (number | null)[];
  onRetry: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, questions, answers, onRetry, onHome }) => {
  const correctCount = score / 10;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Prepare chart data by category
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  
  questions.forEach((q, idx) => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0 };
    }
    categoryStats[q.category].total += 1;
    if (answers[idx] === q.correctAnswer) {
      categoryStats[q.category].correct += 1;
    }
  });

  const chartData = Object.keys(categoryStats).map(cat => ({
    name: cat.split(' ').slice(0, 2).join(' ') + '...', // Shorten name
    fullname: cat,
    correct: categoryStats[cat].correct,
    total: categoryStats[cat].total,
    percent: Math.round((categoryStats[cat].correct / categoryStats[cat].total) * 100)
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-navy-700">
        <h2 className="text-2xl font-serif font-bold text-navy-900 dark:text-white mb-6">Kết Quả Bài Thi</h2>
        
        <div className="flex justify-center items-center mb-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-navy-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={`${percentage >= 50 ? 'text-green-500' : 'text-red-500'}`}
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-navy-900 dark:text-white">{score}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Điểm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle size={20} />
            <span className="font-bold">{correctCount} Đúng</span>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex items-center justify-center gap-2 text-red-700 dark:text-red-400">
            <XCircle size={20} />
            <span className="font-bold">{totalQuestions - correctCount} Sai</span>
          </div>
        </div>

        <div className="h-64 w-full mb-8">
          <h3 className="text-lg font-bold mb-4 text-navy-900 dark:text-white text-left">Phân tích theo chương</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="percent" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} name="Tỷ lệ đúng (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-navy-900 text-navy-900 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            <RefreshCcw size={20} />
            Làm lại
          </button>
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-colors"
          >
            <Home size={20} />
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;