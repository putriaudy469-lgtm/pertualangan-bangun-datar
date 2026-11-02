import { playClick, playCoin } from '../utils/audio';

export default function HeaderBar({
  stars = 120,
  gems = 45,
  level = 3,
  studentName = 'Rizki',
  onOpenProfile,
  onOpenShop,
  onOpenSettings,
}) {
  return (
    <div className="header-container">
      {/* Profile Card */}
      <div
        className="profile-card"
        onClick={() => {
          playClick();
          onOpenProfile?.();
        }}
        title="Klik untuk melihat Profil Siswa"
      >
        <div className="avatar-wrapper">
          {/* Avatar Icon */}
          <div className="avatar-circle">
            <svg viewBox="0 0 48 48" className="avatar-svg">
              <defs>
                <linearGradient id="avatarBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7ad1b8" />
                  <stop offset="100%" stopColor="#3ca287" />
                </linearGradient>
                <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffe0bd" />
                  <stop offset="100%" stopColor="#f5cba7" />
                </linearGradient>
                <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e5888" />
                  <stop offset="100%" stopColor="#0e3557" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#avatarBg)" />
              {/* Hair back */}
              <ellipse cx="24" cy="18" rx="14" ry="13" fill="#1b2838" />
              {/* Face */}
              <ellipse cx="24" cy="22" rx="10" ry="10" fill="url(#skin)" />
              {/* Ears */}
              <circle cx="14" cy="22" r="3" fill="#f5cba7" />
              <circle cx="34" cy="22" r="3" fill="#f5cba7" />
              {/* Hair front */}
              <path
                d="M 12 18 C 14 10, 34 10, 36 18 C 34 15, 30 14, 27 16 C 24 13, 19 14, 16 17 Z"
                fill="#1b2838"
              />
              {/* Eyes */}
              <circle cx="20.5" cy="21.5" r="1.8" fill="#1e293b" />
              <circle cx="27.5" cy="21.5" r="1.8" fill="#1e293b" />
              <circle cx="21" cy="21" r="0.6" fill="#ffffff" />
              <circle cx="28" cy="21" r="0.6" fill="#ffffff" />
              {/* Smile */}
              <path
                d="M 21.5 25.5 Q 24 28 26.5 25.5"
                fill="none"
                stroke="#d35400"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Cheeks */}
              <circle cx="18" cy="24" r="1.5" fill="#ff7675" opacity="0.6" />
              <circle cx="30" cy="24" r="1.5" fill="#ff7675" opacity="0.6" />
              {/* Clothes */}
              <path
                d="M 14 44 C 14 34, 34 34, 34 44 Z"
                fill="url(#shirt)"
              />
              <path
                d="M 21 34 L 24 38 L 27 34"
                fill="none"
                stroke="#54a0ff"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-role">Siswa</div>
          <div className="profile-name">{studentName}</div>
          <div className="level-bar-bg">
            <div className="level-bar-fill" style={{ width: '68%' }}></div>
          </div>
          <div className="profile-level">Level {level}</div>
        </div>
      </div>

      {/* Right Stats & Settings */}
      <div className="header-stats">
        {/* Star Badge */}
        <div
          className="currency-badge star-badge"
          onClick={() => {
            playCoin();
            onOpenShop?.('star');
          }}
          title="Bintang Petualang"
        >
          <div className="currency-icon-wrapper star-glow">
            <svg viewBox="0 0 32 32" className="currency-icon">
              <defs>
                <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff385" />
                  <stop offset="50%" stopColor="#ffc83b" />
                  <stop offset="100%" stopColor="#e59400" />
                </linearGradient>
                <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#995700" />
                </filter>
              </defs>
              <polygon
                points="16,2 20.3,10.7 29.8,12.1 22.9,18.8 24.5,28.3 16,23.8 7.5,28.3 9.1,18.8 2.2,12.1 11.7,10.7"
                fill="url(#starGrad)"
                stroke="#fff8b3"
                strokeWidth="1"
                filter="url(#starShadow)"
              />
            </svg>
          </div>
          <span className="currency-value">{stars}</span>
          <button className="add-btn" aria-label="Tambah Bintang">
            <span>+</span>
          </button>
        </div>

        {/* Diamond Badge */}
        <div
          className="currency-badge gem-badge"
          onClick={() => {
            playCoin();
            onOpenShop?.('gem');
          }}
          title="Permata Ajaib"
        >
          <div className="currency-icon-wrapper gem-glow">
            <svg viewBox="0 0 32 32" className="currency-icon">
              <defs>
                <linearGradient id="gemGradTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bbf2f6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="gemGradBot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>
              {/* Gem Top */}
              <polygon points="10,6 22,6 28,13 4,13" fill="url(#gemGradTop)" stroke="#e0f2fe" strokeWidth="0.8" />
              {/* Gem Bottom */}
              <polygon points="4,13 28,13 16,28" fill="url(#gemGradBot)" stroke="#0369a1" strokeWidth="0.8" />
              {/* Highlight facet */}
              <polygon points="12,13 20,13 16,28" fill="#38bdf8" opacity="0.6" />
            </svg>
          </div>
          <span className="currency-value">{gems}</span>
          <button className="add-btn" aria-label="Tambah Permata">
            <span>+</span>
          </button>
        </div>

        {/* Settings Button */}
        <button
          className="settings-btn"
          onClick={() => {
            playClick();
            onOpenSettings?.();
          }}
          title="Pengaturan"
          aria-label="Pengaturan"
        >
          <svg viewBox="0 0 24 24" className="settings-icon">
            <path
              fill="#ffffff"
              d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
