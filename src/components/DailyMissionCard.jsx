import { playClick } from '../utils/audio';

export default function DailyMissionCard({
  progress = 1,
  total = 3,
  onOpenMission,
}) {
  const percent = Math.min(100, Math.round((progress / total) * 100));

  return (
    <div
      className="daily-mission-card"
      onClick={() => {
        playClick();
        onOpenMission?.();
      }}
      title="Misi Hari Ini: Selesaikan 3 level dengan nilai sempurna"
    >
      {/* Clipboard Icon */}
      <div className="mission-icon-container">
        <svg viewBox="0 0 36 36" className="mission-svg">
          <defs>
            <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4da3ff" />
              <stop offset="100%" stopColor="#1e70d4" />
            </linearGradient>
            <linearGradient id="clipGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffda6a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {/* Clipboard body */}
          <rect x="5" y="6" width="26" height="27" rx="5" fill="url(#boardGrad)" />
          {/* Inner Paper */}
          <rect x="8" y="9" width="20" height="21" rx="3" fill="#ffffff" />
          {/* Paper lines */}
          <rect x="11" y="15" width="14" height="2" rx="1" fill="#93c5fd" />
          <rect x="11" y="19" width="10" height="2" rx="1" fill="#93c5fd" />
          <rect x="11" y="23" width="12" height="2" rx="1" fill="#93c5fd" />
          {/* Top Clip */}
          <rect x="13" y="3" width="10" height="6" rx="2" fill="url(#clipGrad)" stroke="#d97706" strokeWidth="0.5" />
          <circle cx="18" cy="5" r="1.2" fill="#ffffff" />
        </svg>
      </div>

      {/* Mission Text & Progress */}
      <div className="mission-body">
        <div className="mission-header-row">
          <span className="mission-title">Misi Hari Ini</span>
          <svg className="mission-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="mission-desc">Selesaikan 3 level dengan nilai sempurna</p>
        <div className="mission-progress-row">
          <div className="mission-progress-bar">
            <div
              className="mission-progress-fill"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <span className="mission-counter">
            {progress}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}
