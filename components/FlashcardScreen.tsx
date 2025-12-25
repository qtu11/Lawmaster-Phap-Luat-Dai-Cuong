import React, { useState } from 'react';
import { Question } from '../types';
import { RotateCw, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface FlashcardScreenProps {
  questions: Question[];
  onExit: () => void;
}

const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ questions, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % questions.length);
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + questions.length) % questions.length);
    }, 300);
  };

  const currentQ = questions[currentIdx];
  const explanationText = currentQ.explanation || `Đáp án đúng là: ${currentQ.options[currentQ.correctAnswer]}`;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-4 flex justify-between items-center text-navy-900 dark:text-white">
        <span className="font-bold text-lg">Thẻ {currentIdx + 1}/{questions.length}</span>
        <button onClick={onExit} className="p-2 bg-gray-200 dark:bg-navy-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div 
        className="relative w-full max-w-2xl h-96 cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`flip-card w-full h-full ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner rounded-3xl shadow-2xl">
            {/* Front */}
            <div className="flip-card-front bg-white dark:bg-navy-800 rounded-3xl border-2 border-navy-100 dark:border-navy-600 p-8 flex flex-col justify-center items-center">
              <span className="text-gold-500 font-bold tracking-widest uppercase mb-4 text-sm">Câu hỏi</span>
              <h3 className="text-xl md:text-2xl font-serif text-navy-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
              <p className="mt-6 text-gray-400 text-sm flex items-center gap-1 animate-pulse">
                <RotateCw size={14} /> Chạm để lật
              </p>
            </div>

            {/* Back */}
            <div className="flip-card-back bg-navy-900 dark:bg-navy-950 rounded-3xl p-8 flex flex-col justify-center items-center text-white rotate-y-180">
               <span className="text-gold-400 font-bold tracking-widest uppercase mb-4 text-sm">Đáp án</span>
               <p className="text-xl font-bold text-center mb-6">
                 {currentQ.options[currentQ.correctAnswer]}
               </p>
               <div className="bg-navy-800 p-4 rounded-xl text-sm text-gray-300">
                 {explanationText}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={handlePrev}
          className="p-4 bg-white dark:bg-navy-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-navy-700 text-navy-900 dark:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="p-4 bg-gold-500 rounded-full shadow-lg hover:bg-gold-600 text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardScreen;