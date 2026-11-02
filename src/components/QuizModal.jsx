import { useState } from 'react';
import { playClick, playSuccess, playBounce } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

const QUESTIONS = [
  {
    level: 1,
    title: 'Level 1: Gerbang Segitiga Ajaib',
    question: 'Berapakah jumlah titik sudut pada bangun Segitiga?',
    options: ['3 Sudut', '4 Sudut', '5 Sudut', 'Tidak Memiliki Sudut'],
    correct: 0,
    hint: 'Lihat bentuk karakter Tio yang memiliki 3 sudut lancip!',
    shapeSvg: (
      <polygon points="50,15 88,85 12,85" fill="#fcd34d" stroke="#f59e0b" strokeWidth="5" />
    ),
  },
  {
    level: 2,
    title: 'Level 2: Jembatan Persegi',
    question: 'Sebuah persegi memiliki panjang sisi 6 cm. Berapakah Luas persegi tersebut? (L = s × s)',
    options: ['24 cm²', '36 cm²', '12 cm²', '30 cm²'],
    correct: 1,
    hint: 'Hitung 6 dikali 6!',
    shapeSvg: (
      <rect x="25" y="25" width="50" height="50" rx="4" fill="#93c5fd" stroke="#3b82f6" strokeWidth="5" />
    ),
  },
  {
    level: 3,
    title: 'Level 3: Danau Lingkaran Mistis',
    question: 'Bangun datar yang memiliki simetri lipat tak terhingga dan tidak memiliki sudut adalah...',
    options: ['Trapesium', 'Persegi Panjang', 'Lingkaran', 'Belah Ketupat'],
    correct: 2,
    hint: 'Bentuk seperti koin atau roda sepeda!',
    shapeSvg: (
      <circle cx="50" cy="50" r="35" fill="#fca5a5" stroke="#ef4444" strokeWidth="5" />
    ),
  },
];

export default function QuizModal({ initialLevel = 1, onClose, onRewardStars }) {
  const [currentIdx, setCurrentIdx] = useState(
    Math.min(Math.max(initialLevel - 1, 0), QUESTIONS.length - 1)
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correct) {
      playSuccess();
      launchConfetti();
      onRewardStars?.(15);
    } else {
      playBounce();
    }
  };

  const handleNext = () => {
    playClick();
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container quiz-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">Petualangan Matematika</span>
            <h2 className="modal-title">{currentQ.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>

        {/* Level Indicator */}
        <div className="quiz-progress-track">
          {QUESTIONS.map((q, idx) => (
            <div
              key={idx}
              className={`quiz-dot ${
                idx === currentIdx ? 'active' : idx < currentIdx ? 'completed' : ''
              }`}
            ></div>
          ))}
        </div>

        {/* Question Area */}
        <div className="quiz-card-body">
          <div className="quiz-shape-icon">
            <svg viewBox="0 0 100 100" className="shape-mini-svg">
              {currentQ.shapeSvg}
            </svg>
          </div>

          <h3 className="quiz-question-text">{currentQ.question}</h3>

          {/* Options */}
          <div className="quiz-options-grid">
            {currentQ.options.map((option, idx) => {
              let btnClass = 'quiz-option-btn';
              if (isAnswered) {
                if (idx === currentQ.correct) {
                  btnClass += ' correct';
                } else if (idx === selectedOption) {
                  btnClass += ' wrong';
                }
              }
              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback message */}
          {isAnswered && (
            <div
              className={`feedback-banner ${
                selectedOption === currentQ.correct ? 'feedback-success' : 'feedback-error'
              }`}
            >
              {selectedOption === currentQ.correct ? (
                <span>🎉 Hebat sekali! Jawabanmu benar! (+15 ⭐ Bintang)</span>
              ) : (
                <span>💡 Ups! Belum tepat. Petunjuk: {currentQ.hint}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {isAnswered ? (
            <button className="action-btn-primary" onClick={handleNext}>
              {currentIdx < QUESTIONS.length - 1 ? 'Lanjut Level Berikutnya ➔' : 'Selesai & Kumpulkan Hadiah 🏆'}
            </button>
          ) : (
            <p className="quiz-helper-note">Pilihlah salah satu jawaban yang menurutmu benar!</p>
          )}
        </div>
      </div>
    </div>
  );
}
