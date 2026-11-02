
const BADGES = [
  { id: 1, title: 'Penjelajah Pemula', desc: 'Menyelesaikan level pertama', icon: '🌱', unlocked: true },
  { id: 2, title: 'Pakar Segitiga', desc: 'Menjawab 5 kuis segitiga tanpa salah', icon: '📐', unlocked: true },
  { id: 3, title: 'Kolektor Bintang', desc: 'Mengumpulkan 100+ Bintang Emas', icon: '⭐', unlocked: true },
  { id: 4, title: 'Master Persegi', desc: 'Menghitung luas 10 persegi dengan tepat', icon: '🟦', unlocked: false },
  { id: 5, title: 'Raja Lingkaran', desc: 'Memahami rumus π dan jari-jari lingkaran', icon: '🔴', unlocked: false },
  { id: 6, title: 'Juara Geometri', desc: 'Menyelesaikan seluruh peta petualangan', icon: '👑', unlocked: false },
];

export default function PrestasiView() {
  return (
    <div className="tab-view-container prestasi-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title">🏆 Ruang Prestasi & Medali</h2>
        <p className="tab-view-subtitle">Raih semua medali kehormatan penjelajah!</p>
      </div>

      <div className="badges-grid">
        {BADGES.map((b) => (
          <div key={b.id} className={`badge-card ${b.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon-box">{b.icon}</div>
            <div className="badge-info">
              <h4 className="badge-title">{b.title}</h4>
              <p className="badge-desc">{b.desc}</p>
              <span className="badge-status-tag">
                {b.unlocked ? '✓ Terbuka' : '🔒 Terkunci'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
