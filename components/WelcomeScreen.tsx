import React, { useState, useMemo } from 'react';
import { Trophy, Play, BrainCircuit, Settings, Layers, Shuffle, CheckCircle2 } from 'lucide-react';
import { LeaderboardEntry, QuizConfig, QuizMode } from '../types';
import { QUESTIONS } from '../constants';

interface WelcomeScreenProps {
  onStartQuiz: (name: string, config: QuizConfig) => void;
  onStartFlashcard: (name: string) => void;
  leaderboard: LeaderboardEntry[];
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartQuiz, onStartFlashcard, leaderboard }) => {
  const [name, setName] = useState('');
  
  // Quiz Configuration State
  const [mode, setMode] = useState<QuizMode>('random');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(QUESTIONS.map(q => q.category));
    return Array.from(cats);
  }, []);

  // Set default category if switching to topic mode
  const handleModeChange = (m: QuizMode) => {
    setMode(m);
    if (m === 'topic' && !selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  };

  const handleSubmit = (type: 'quiz' | 'flashcard') => {
    if (name.trim()) {
      if (type === 'quiz') {
        onStartQuiz(name, {
          mode,
          questionCount,
          selectedCategory: mode === 'topic' ? selectedCategory : undefined
        });
      } else {
        onStartFlashcard(name);
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto py-6">
      
      {/* Left Column: User & Config */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-8 border-t-4 border-gold-500 transition-colors">
          <h2 className="text-3xl font-serif font-bold text-center text-navy-900 dark:text-white mb-2">
            Hệ Thống Ôn Tập
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Nhập thông tin và tùy chỉnh bài thi của bạn
          </p>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Họ và tên sinh viên
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy-600 dark:bg-navy-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Config Section */}
            <div className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-4 border border-gray-100 dark:border-navy-600">
              <div className="flex items-center gap-2 mb-3 text-navy-900 dark:text-gold-400 font-bold text-sm uppercase tracking-wide">
                <Settings size={16} />
                Cấu hình đề thi
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => handleModeChange('random')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all ${
                    mode === 'random' 
                      ? 'bg-navy-900 text-white shadow-md' 
                      : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-navy-600'
                  }`}
                >
                  <Shuffle size={16} /> Ngẫu nhiên
                </button>
                <button
                  onClick={() => handleModeChange('topic')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all ${
                    mode === 'topic' 
                      ? 'bg-navy-900 text-white shadow-md' 
                      : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-navy-600'
                  }`}
                >
                  <Layers size={16} /> Theo chủ đề
                </button>
              </div>

              {/* Topic Selection (Visible only in Topic mode) */}
              {mode === 'topic' && (
                <div className="mb-4 animate-fade-in-down">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">CHỌN CHỦ ĐỀ</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg text-sm bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Question Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">SỐ LƯỢNG CÂU HỎI</label>
                <div className="flex gap-2">
                  {[20, 50, 100, QUESTIONS.length].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${
                        questionCount === count
                          ? 'bg-gold-500 border-gold-500 text-white'
                          : 'bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {count === QUESTIONS.length ? 'Tất cả' : count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSubmit('quiz')}
                disabled={!name.trim()}
                className="flex flex-col items-center justify-center p-4 bg-navy-900 hover:bg-navy-800 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
              >
                <Play className="mb-1 text-gold-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Bắt Đầu Thi</span>
              </button>
              <button
                onClick={() => handleSubmit('flashcard')}
                disabled={!name.trim()}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-navy-900 text-navy-900 hover:bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
              >
                <BrainCircuit className="mb-1 text-gold-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Học Flashcard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm">
          <Trophy className="text-gold-500" />
          <div>
            <h3 className="text-lg font-bold text-navy-900 dark:text-white leading-tight">Bảng Xếp Hạng</h3>
            <p className="text-xs text-gray-500">Top sinh viên xuất sắc nhất</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-navy-700">
          {leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
              <Trophy size={48} strokeWidth={1} className="mb-4 opacity-50" />
              <p>Chưa có dữ liệu xếp hạng.</p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead className="bg-navy-50 dark:bg-navy-900 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left text-navy-900 dark:text-gold-400 font-bold">#</th>
                    <th className="p-3 text-left text-navy-900 dark:text-white font-bold">Sinh viên</th>
                    <th className="p-3 text-right text-navy-900 dark:text-gold-400 font-bold">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-navy-700">
                  {leaderboard.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
                      <td className="p-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-gold-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-400 text-white' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                        {entry.name}
                        {index < 3 && <CheckCircle2 size={12} className="inline ml-1 text-blue-500" />}
                      </td>
                      <td className="p-3 text-right font-bold text-gold-600">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;