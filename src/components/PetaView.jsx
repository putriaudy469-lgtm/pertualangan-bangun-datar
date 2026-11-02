import { useEffect, useRef, useState } from 'react';
import { playClick } from '../utils/audio';
import DailyMissionCard from './DailyMissionCard';

const REGIONS = [
  {
    id: 1,
    name: 'Pulau Bentuk',
    gate: 'Gerbang Pulau Bentuk',
    purpose: 'Mengenali persegi, segitiga, persegi panjang, dan lingkaran.',
    subtitle: 'Mengenal bentuk dasar',
    image: '/map-island-forest.png',
    levels: [
      [1, 16, 26.5], [2, 29, 26.5], [3, 42, 26.5],
    ],
  },
  {
    id: 2,
    name: 'Hutan Segi Empat',
    gate: 'Gerbang Hutan Segi Empat',
    purpose: 'Mengenal sisi, sudut, dan jenis-jenis segi empat.',
    subtitle: 'Sisi, sudut, dan jenis-jenisnya',
    image: '/map-island-shapes.png',
    levels: [
      [4, 66, 35], [5, 74, 35], [6, 82, 35],
    ],
  },
  {
    id: 3,
    name: 'Pegunungan Segitiga',
    gate: 'Gerbang Pegunungan Segitiga',
    purpose: 'Mengenal jenis segitiga dan menghitung keliling.',
    subtitle: 'Jenis segitiga dan keliling',
    image: '/map-island-mountain.png',
    levels: [
      [7, 18, 52], [8, 27, 52], [9, 36, 52],
    ],
  },
  {
    id: 4,
    name: 'Danau Lingkaran',
    gate: 'Gerbang Danau Lingkaran',
    purpose: 'Mengenal jari-jari, diameter, dan luas lingkaran.',
    subtitle: 'Jari-jari, diameter, dan luas',
    image: '/map-island-lake.png',
    levels: [
      [10, 68, 61.5], [11, 77, 61.5], [12, 86, 61.5],
    ],
  },
  {
    id: 5,
    name: 'Kastil Geometri',
    gate: 'Gerbang Kastil Geometri',
    purpose: 'Menggabungkan berbagai bangun datar untuk memecahkan tantangan.',
    subtitle: 'Gabungan bangun datar',
    image: '/map-island-castle.png',
    levels: [
      [13, 42, 77], [14, 50, 77], [15, 58, 77],
    ],
  },
];

const ALL_LEVELS = REGIONS.flatMap((region) =>
  region.levels.map(([id, x, y]) => ({ id, x, y, region }))
);

export default function PetaView({
  completedLevels = [],
  missionProgress = 1,
  onSelectLevel,
  onOpenMission,
  onOpenCollection,
  onClose,
}) {
  const [walker, setWalker] = useState(ALL_LEVELS[0]);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const selectionTimer = useRef(null);
  const completedLevelIds = new Set(completedLevels);
  const nextLevelId = ALL_LEVELS.find((level) => !completedLevelIds.has(level.id))?.id;

  useEffect(() => () => window.clearTimeout(selectionTimer.current), []);

  const handleLevelClick = (level, status) => {
    if (status === 'locked') return;
    playClick();
    setSelectedLevelId(level.id);
    setWalker(level);
    setIsWalking(true);
    window.clearTimeout(selectionTimer.current);
    selectionTimer.current = window.setTimeout(() => {
      setIsWalking(false);
      onSelectLevel?.({
        id: level.id,
        name: level.region.name,
        gate: level.region.gate,
        purpose: level.region.purpose,
        status,
      });
    }, 850);
  };

  return (
    <section className="tab-view-container peta-view" aria-label="Peta Petualangan">
      <img className="peta-sky" src="/map-background.jpg" alt="" />

      <button
        className="peta-back-button"
        onClick={() => {
          playClick();
          onClose?.();
        }}
        aria-label="Kembali ke beranda"
      >
        ‹
      </button>

      <header className="peta-title-banner">
        <h2>Peta Petualangan</h2>
        <p>Jelajahi Dunia, Temukan Bentuknya!</p>
      </header>

      <DailyMissionCard
        progress={missionProgress}
        total={3}
        onOpenMission={onOpenMission}
      />

      <svg className="peta-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M47 28 C53 28 55 35 59 39 C65 44 61 48 53 50 C46 52 49 58 57 62 C63 66 64 68 56 73 C51 77 51 79 51 84" />
      </svg>

      {REGIONS.map((region) => (
        <section
          key={region.id}
          className={`peta-region peta-region-${region.id}`}
          aria-label={region.name}
        >
          <img className="peta-island-image" src={region.image} alt="" draggable="false" />
          <div className={`peta-region-heading peta-region-heading-${region.id}`}>
            <span className="peta-region-number">{region.id}</span>
            <span className="peta-region-copy">
              <strong>{region.name}</strong>
              <small>{region.subtitle}</small>
            </span>
          </div>
        </section>
      ))}

      {ALL_LEVELS.map((level) => {
        const status = completedLevelIds.has(level.id)
          ? 'completed'
          : level.id === nextLevelId
            ? 'current'
            : 'locked';

        return (
          <button
            key={level.id}
            className={`map-level-node ${status}${level.id === 1 ? ' has-stars' : ''}${selectedLevelId === level.id ? ' selected' : ''}`}
            style={{ left: `${level.x}%`, top: `${level.y}%` }}
            onClick={() => handleLevelClick(level, status)}
            disabled={status === 'locked'}
            aria-label={`Level ${level.id}: ${level.region.name}${status === 'locked' ? ', terkunci' : status === 'completed' ? ', selesai' : ', siap dimainkan'}`}
            title={`Level ${level.id} — ${level.region.name}${status === 'locked' ? ' (terkunci)' : ''}`}
          >
            <span>{level.id}</span>
            {status === 'locked' && (
              <span className="map-level-lock" aria-hidden="true">
                <svg viewBox="0 0 20 24" focusable="false">
                  <path d="M5 10V7a5 5 0 0 1 10 0v3" />
                  <rect x="2" y="10" width="16" height="12" rx="3" />
                  <circle cx="10" cy="15" r="1.5" />
                  <path d="M10 16.5v2" />
                </svg>
              </span>
            )}
            {status === 'completed' && <span className="map-level-complete" aria-hidden="true">✓</span>}
            {level.id === 1 && (
              <span className="map-level-stars" aria-label="3 bintang">★★★</span>
            )}
          </button>
        );
      })}

      <img
        className={`peta-triangle-walker${isWalking ? ' walking' : ''}`}
        src="/adventure-mascot.png"
        alt="Maskot segitiga berjalan ke level yang dipilih"
        style={{ left: `${walker.x}%`, top: `${walker.y}%` }}
      />

      <button
        className="peta-collection-badge"
        onClick={() => {
          playClick();
          onOpenCollection?.();
        }}
      >
        <span className="peta-collection-icon" aria-hidden="true">🎁</span>
        <span><strong>Koleksi Bentuk</strong><small>3/24</small></span>
        <span className="peta-collection-arrow" aria-hidden="true">›</span>
      </button>
    </section>
  );
}
