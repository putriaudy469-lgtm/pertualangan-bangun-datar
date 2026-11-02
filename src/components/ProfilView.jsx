import { playClick } from '../utils/audio';

export default function ProfilView({
  studentName = 'Rizki',
  level = 3,
  stars = 120,
  gems = 45,
  xp = 0,
  onOpenSettings,
}) {
  const xpWithinLevel = xp % 500;
  const xpToNextLevel = 500 - xpWithinLevel;

  return (
    <div className="tab-view-container profil-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title">👤 Profil Kartu Pelajar</h2>
      </div>

      <div className="profile-hero-card">
        <div className="profile-avatar-large">
          <svg viewBox="0 0 48 48" className="avatar-svg">
            <circle cx="24" cy="24" r="23" fill="#3ca287" />
            <ellipse cx="24" cy="18" rx="14" ry="13" fill="#1b2838" />
            <ellipse cx="24" cy="22" rx="10" ry="10" fill="#f5cba7" />
            <circle cx="14" cy="22" r="3" fill="#f5cba7" />
            <circle cx="34" cy="22" r="3" fill="#f5cba7" />
            <path d="M 12 18 C 14 10, 34 10, 36 18 C 34 15, 30 14, 27 16 C 24 13, 19 14, 16 17 Z" fill="#1b2838" />
            <circle cx="20.5" cy="21.5" r="1.8" fill="#1e293b" />
            <circle cx="27.5" cy="21.5" r="1.8" fill="#1e293b" />
            <circle cx="21" cy="21" r="0.6" fill="#ffffff" />
            <circle cx="28" cy="21" r="0.6" fill="#ffffff" />
            <path d="M 21.5 25.5 Q 24 28 26.5 25.5" fill="none" stroke="#d35400" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 14 44 C 14 34, 34 34, 34 44 Z" fill="#1e5888" />
          </svg>
        </div>

        <div className="profile-meta">
          <span className="profile-student-tag">Siswa Kelas 4 SD</span>
          <h3 className="profile-big-name">{studentName}</h3>
          <div className="profile-level-badge">Level Petualang {level}</div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="profile-stat-box">
        <div className="stat-row-header">
          <span>Pengalaman (XP):</span>
          <span className="bold-xp">{xpWithinLevel} / 500 XP</span>
        </div>
        <div className="level-bar-bg full-bar">
          <div className="level-bar-fill" style={{ width: `${(xpWithinLevel / 500) * 100}%` }}></div>
        </div>
        <p className="xp-note">
          Total {xp} XP. Dapatkan {xpToNextLevel} XP lagi untuk level pengalaman berikutnya.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <span className="stat-card-icon">⭐</span>
          <span className="stat-card-num">{stars}</span>
          <span className="stat-card-text">Total Bintang</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">💎</span>
          <span className="stat-card-num">{gems}</span>
          <span className="stat-card-text">Permata Ajaib</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">🎯</span>
          <span className="stat-card-num">88%</span>
          <span className="stat-card-text">Akurasi Kuis</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">🏅</span>
          <span className="stat-card-num">3 / 6</span>
          <span className="stat-card-text">Medali Terbuka</span>
        </div>
      </div>

      <div className="profile-footer-actions">
        <button
          className="action-btn-secondary"
          onClick={() => {
            playClick();
            onOpenSettings?.();
          }}
        >
          ⚙️ Buka Pengaturan Akun
        </button>
      </div>
    </div>
  );
}
