import { playCoin } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

export default function MissionModal({ onClose, onClaimReward }) {
  const missions = [
    {
      id: 1,
      title: 'Selesaikan 3 level dengan nilai sempurna',
      progress: 1,
      target: 3,
      reward: '50 ⭐ + 5 💎',
      claimed: false,
    },
    {
      id: 2,
      title: 'Pelajari sifat bangun Segitiga di menu Kenali',
      progress: 1,
      target: 1,
      reward: '20 ⭐',
      claimed: true,
    },
    {
      id: 3,
      title: 'Kumpulkan total 150 Bintang petualang',
      progress: 120,
      target: 150,
      reward: '30 ⭐ + 10 💎',
      claimed: false,
    },
  ];

  const handleClaim = () => {
    playCoin();
    launchConfetti();
    onClaimReward?.(25);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">Misi Harian</span>
            <h2 className="modal-title">Daftar Misi Petualang</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mission-list-content">
          {missions.map((m) => (
            <div key={m.id} className="mission-item-card">
              <div className="mission-item-header">
                <span className="mission-item-title">{m.title}</span>
                <span className="mission-item-reward">{m.reward}</span>
              </div>
              <div className="mission-item-bar-row">
                <div className="mission-progress-bar full-w">
                  <div
                    className="mission-progress-fill"
                    style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                  ></div>
                </div>
                <span className="mission-counter">
                  {m.progress}/{m.target}
                </span>
              </div>
              <div className="mission-item-action">
                {m.progress >= m.target ? (
                  <button
                    className="claim-btn active"
                    disabled={m.claimed}
                    onClick={() => handleClaim(m)}
                  >
                    {m.claimed ? 'Sudah Diklaim ✓' : 'Klaim Hadiah 🎁'}
                  </button>
                ) : (
                  <span className="mission-status-text">Sedang Berlangsung...</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="action-btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
