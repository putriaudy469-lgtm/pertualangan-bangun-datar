import { playSuccess } from '../utils/audio';

export default function PlayButton({ onClick }) {
  const handleClick = (e) => {
    playSuccess();
    onClick?.(e);
  };

  return (
    <div className="play-button-container">
      <button
        className="play-button"
        onClick={handleClick}
        aria-label="Mulai Petualangan"
      >
        {/* Play Icon */}
        <div className="play-icon-box">
          <svg viewBox="0 0 40 40" className="play-triangle-svg">
            <defs>
              <filter id="playShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#334155" floodOpacity="0.3" />
              </filter>
            </defs>
            {/* White play triangle */}
            <path
              d="M 12 8 C 12 6.5, 13.8 5.6, 15 6.4 L 32 17.5 C 33.2 18.3, 33.2 20.2, 32 21 L 15 32.1 C 13.8 32.9, 12 32, 12 30.5 Z"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              filter="url(#playShadow)"
            />
          </svg>
        </div>

        {/* Text */}
        <span className="play-button-text">Mulai Petualangan</span>

        {/* Subtle Shine Highlight */}
        <div className="button-shine"></div>
      </button>
    </div>
  );
}
