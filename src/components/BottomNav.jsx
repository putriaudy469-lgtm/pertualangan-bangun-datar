import { playTab } from '../utils/audio';

export default function BottomNav({ activeTab = 'beranda', onTabChange }) {
  const tabs = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="nav-icon" fill={isActive ? '#1877f2' : 'none'} stroke={isActive ? '#1877f2' : '#5c7490'} strokeWidth={isActive ? '0' : '2'}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={isActive ? '#1565c0' : 'currentColor'} />
        </svg>
      ),
    },
    {
      id: 'peta',
      label: 'Peta',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke={isActive ? '#1565c0' : '#5c7490'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" fill={isActive ? '#e3f2fd' : 'none'} />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke={isActive ? '#1565c0' : '#5c7490'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
          <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill={isActive ? '#e3f2fd' : 'none'} />
        </svg>
      ),
    },
    {
      id: 'materi',
      label: 'Materi',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke={isActive ? '#1565c0' : '#5c7490'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill={isActive ? '#e3f2fd' : 'none'} />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill={isActive ? '#e3f2fd' : 'none'} />
        </svg>
      ),
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke={isActive ? '#1565c0' : '#5c7490'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill={isActive ? '#e3f2fd' : 'none'} />
          <circle cx="12" cy="7" r="4" fill={isActive ? '#e3f2fd' : 'none'} />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="Navigasi Utama">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                playTab();
                onTabChange?.(tab.id);
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`nav-icon-wrapper ${isActive ? 'active-pill' : ''}`}>
                {tab.icon(isActive)}
              </div>
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
