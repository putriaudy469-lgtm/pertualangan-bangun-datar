import { useEffect, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import DailyMissionCard from './components/DailyMissionCard';
import PlayButton from './components/PlayButton';
import Signpost from './components/Signpost';
import InteractiveCharacters from './components/InteractiveCharacters';
import BottomNav from './components/BottomNav';

// Modals & Tab Views
import ShapesModal from './components/ShapesModal';
import QuizModal from './components/QuizModal';
import MissionModal from './components/MissionModal';
import ShopModal from './components/ShopModal';
import SettingsModal from './components/SettingsModal';
import PetaView from './components/PetaView';
import LevelIntro from './components/LevelIntro';
import GameView from './components/GameView';
import QuizView from './components/QuizView';
import PrestasiView from './components/PrestasiView';
import ProfilView from './components/ProfilView';

import { isAudioEnabled, setAudioEnabled, playClick } from './utils/audio';
import './App.css';

const PROGRESS_STORAGE_KEY = 'pertualangan-progress';
const INITIAL_PROGRESS = {
  completedLevels: [],
  level: 1,
  stars: 120,
  gems: 45,
  xp: 0,
  bestStarsByLevel: {},
};

function loadProgress() {
  try {
    const savedProgress = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!savedProgress) return INITIAL_PROGRESS;

    const parsedProgress = JSON.parse(savedProgress);
    const completedLevels = Array.isArray(parsedProgress.completedLevels)
      ? [...new Set(parsedProgress.completedLevels.filter(
        (id) => Number.isInteger(id) && id >= 1 && id <= 15
      ))]
      : [];
    const bestStarsByLevel = parsedProgress.bestStarsByLevel
      && typeof parsedProgress.bestStarsByLevel === 'object'
      && !Array.isArray(parsedProgress.bestStarsByLevel)
      ? Object.fromEntries(Object.entries(parsedProgress.bestStarsByLevel).filter(
        ([id, stars]) => Number.isInteger(Number(id))
          && Number(id) >= 1
          && Number(id) <= 15
          && Number.isInteger(stars)
          && stars >= 1
          && stars <= 3
      ))
      : {};
    const level = Number.isInteger(parsedProgress.level) && parsedProgress.level >= 1 && parsedProgress.level <= 15
      ? parsedProgress.level
      : Math.min(15, Math.max(1, ...completedLevels.map((id) => id + 1)));

    return {
      completedLevels,
      level,
      stars: Number.isInteger(parsedProgress.stars) && parsedProgress.stars >= 0
        ? parsedProgress.stars
        : INITIAL_PROGRESS.stars,
      gems: Number.isInteger(parsedProgress.gems) && parsedProgress.gems >= 0
        ? parsedProgress.gems
        : INITIAL_PROGRESS.gems,
      xp: Number.isInteger(parsedProgress.xp) && parsedProgress.xp >= 0
        ? parsedProgress.xp
        : INITIAL_PROGRESS.xp,
      bestStarsByLevel,
    };
  } catch (error) {
    console.error('Gagal memuat progres permainan.', error);
    return INITIAL_PROGRESS;
  }
}

function App() {
  // Game State matching the reference mockup
  const [progress, setProgress] = useState(loadProgress);
  const { completedLevels, level, stars, gems, xp, bestStarsByLevel } = progress;
  const [studentName, setStudentName] = useState('Rizki');
  const [missionProgress, setMissionProgress] = useState(1);
  const [levelExplorationPoints, setLevelExplorationPoints] = useState(0);
  const [levelCoinsCollected, setLevelCoinsCollected] = useState(0);
  const [activeTab, setActiveTab] = useState('beranda');
  const [quizLevel, setQuizLevel] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Modals
  const [isShapesOpen, setIsShapesOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [shopTab, setShopTab] = useState(null); // 'star' | 'gem' | null
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Desktop Controls
  const [isFrameless, setIsFrameless] = useState(false);
  const [isMuted, setIsMuted] = useState(!isAudioEnabled());

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Gagal menyimpan progres permainan.', error);
    }
  }, [progress]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'materi') {
      setIsShapesOpen(true);
    }
  };

  const handleToggleSound = () => {
    playClick();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setAudioEnabled(!nextMuted);
  };

  const handleRewardStars = (amount) => {
    setProgress((previous) => ({ ...previous, stars: previous.stars + amount }));
    setMissionProgress((prev) => Math.min(3, prev + 1));
  };

  const handleAddCurrency = (type, amount) => {
    const currency = type === 'star' ? 'stars' : 'gems';
    setProgress((previous) => ({ ...previous, [currency]: previous[currency] + amount }));
  };

  const handleLevelComplete = (completedLevelId, result) => {
    const isNewCompletion = !completedLevels.includes(completedLevelId);
    const previousBestStars = bestStarsByLevel[completedLevelId] ?? 0;
    const earnedStarDifference = Math.max(0, result.stars - previousBestStars);

    setProgress((previous) => ({
      ...previous,
      completedLevels: previous.completedLevels.includes(completedLevelId)
        ? previous.completedLevels
        : [...previous.completedLevels, completedLevelId],
      level: Math.min(15, Math.max(previous.level, completedLevelId + 1)),
      stars: previous.stars + earnedStarDifference,
      xp: previous.xp + (isNewCompletion ? 100 : 0),
      bestStarsByLevel: {
        ...previous.bestStarsByLevel,
        [completedLevelId]: Math.max(previousBestStars, result.stars),
      },
    }));

    if (isNewCompletion) setMissionProgress((previous) => Math.min(3, previous + 1));
    setLevelExplorationPoints(0);
    setActiveTab('peta');
  };

  return (
    <div className="device-wrapper">
      {/* Top Desktop Controls Bar */}
      <aside className="desktop-controls-bar" aria-label="Kontrol Tampilan">
        <button
          className={`ctrl-btn ${!isFrameless ? 'active' : ''}`}
          onClick={() => setIsFrameless(false)}
          title="Tampilan Bingkai HP"
        >
          📱 Bingkai HP
        </button>
        <button
          className={`ctrl-btn ${isFrameless ? 'active' : ''}`}
          onClick={() => setIsFrameless(true)}
          title="Tampilan Pas Layar"
        >
          🖥️ Pas Layar
        </button>
        <button
          className="ctrl-btn"
          onClick={handleToggleSound}
          title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Suara'}
        >
          {isMuted ? '🔇 Mute' : '🔊 Suara ON'}
        </button>
        <button
          className="ctrl-btn"
          onClick={() => {
            playClick();
            setProgress(INITIAL_PROGRESS);
            setStudentName('Rizki');
            setActiveTab('beranda');
          }}
          title="Reset ke Tampilan Awal Gambar"
        >
          ↺ Reset 100%
        </button>
      </aside>

      {/* Smartphone Device Frame */}
      <div className={`phone-case ${isFrameless ? 'frameless' : ''}`}>
        {/* Dynamic Island / Notch */}
        {!isFrameless && activeTab !== 'beranda' && activeTab !== 'peta' && activeTab !== 'level' && activeTab !== 'game' && activeTab !== 'soal' && (
          <div className="phone-notch">
            <div className="notch-sensor"></div>
            <div className="notch-camera"></div>
          </div>
        )}

        {/* Screen Container */}
        <main
          className={`phone-screen ${activeTab === 'beranda' ? 'home-screen' : ''} ${activeTab === 'peta' ? 'map-screen' : ''} ${activeTab === 'prestasi' ? 'prestasi-screen' : ''} ${activeTab === 'profil' ? 'profil-screen' : ''} ${activeTab === 'level' ? 'level-screen' : ''} ${activeTab === 'game' ? 'game-screen' : ''} ${activeTab === 'soal' ? 'quiz-screen' : ''}`}
          role="application"
        >
          {/* Top Status Bar (Clock, Wifi, Battery) */}
          {activeTab !== 'soal' && <div className="phone-status-bar">
            <span className="status-time">09:41</span>
            <div className="status-right">
              {/* Cellular Signal */}
              <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
                <rect x="0" y="8" width="2" height="4" rx="0.5" />
                <rect x="3.5" y="6" width="2" height="6" rx="0.5" />
                <rect x="7" y="3" width="2" height="9" rx="0.5" />
                <rect x="10.5" y="0" width="2" height="12" rx="0.5" />
              </svg>
              {/* Wifi */}
              <svg width="14" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.9-2.9l1.4 1.4C9.6 15.6 10.7 15 12 15s2.4.6 3.5 1.5l1.4-1.4C15.4 13.7 13.8 13 12 13s-3.4.7-4.9 2.1zm-3.5-3.5l1.4 1.4C6.9 11.2 9.3 10 12 10s5.1 1.2 7 3l1.4-1.4C18 9.2 15.1 8 12 8s-6 1.2-8.4 3.6z" />
              </svg>
              {/* Battery */}
              <svg width="20" height="11" viewBox="0 0 24 12" fill="currentColor">
                <rect x="1" y="1" width="19" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="3" width="13" height="6" rx="1.5" />
                <path d="M 22 4 L 22 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>}

          {/* Persistent Header Bar */}
          {activeTab !== 'level' && activeTab !== 'game' && activeTab !== 'soal' && (
            <HeaderBar
              stars={stars}
              gems={gems}
              level={level}
              studentName={studentName}
              onOpenProfile={() => setActiveTab('profil')}
              onOpenShop={(type) => setShopTab(type)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* TAB CONTENT: BERANDA (HOME SCREEN - 100% MATCH) */}
          {activeTab === 'beranda' && (
            <section className="home-content" aria-label="Beranda Petualangan">
              <DailyMissionCard
                progress={missionProgress}
                total={3}
                onOpenMission={() => setIsMissionOpen(true)}
              />

              <header className="home-title">
                <img
                  src="/home_logo.png"
                  alt="Petualangan Bangun Datar"
                />
              </header>

              <div className="home-scene" aria-label="Dunia petualangan">
                <InteractiveCharacters />
                <Signpost onClick={() => setIsShapesOpen(true)} />
              </div>

              <PlayButton
                onClick={() => setActiveTab('peta')}
              />
              <img
                className="home-mascot"
                src="/adventure-mascot.png"
                alt="Maskot segitiga petualang"
              />
            </section>
          )}

          {/* TAB CONTENT: PETA VIEW */}
          {activeTab === 'peta' && (
            <PetaView
              completedLevels={completedLevels}
              missionProgress={missionProgress}
              onOpenMission={() => setIsMissionOpen(true)}
              onOpenCollection={() => setIsShapesOpen(true)}
              onSelectLevel={(lvl) => {
                setQuizLevel(lvl.id);
                setSelectedLevel(lvl);
                setLevelExplorationPoints(0);
                setLevelCoinsCollected(0);
                setActiveTab('level');
              }}
              onClose={() => setActiveTab('beranda')}
            />
          )}

          {activeTab === 'level' && selectedLevel && (
            <LevelIntro
              level={selectedLevel}
              stars={stars}
              gems={gems}
              onBack={() => setActiveTab('peta')}
              onStart={() => {
                setLevelExplorationPoints(0);
                setLevelCoinsCollected(0);
                setActiveTab('game');
              }}
            />
          )}

          {activeTab === 'game' && (
            <GameView
              stars={stars}
              gems={gems}
              onAddGem={(amount) => {
                handleAddCurrency('gem', amount);
                setLevelCoinsCollected((previous) => previous + amount);
              }}
              onAddExplorationPoints={(amount) => setLevelExplorationPoints((previous) => previous + amount)}
              onBack={() => {
                setLevelExplorationPoints(0);
                setActiveTab('level');
              }}
              onFinish={() => setActiveTab('soal')}
            />
          )}

          {activeTab === 'soal' && (
            <QuizView
              levelId={selectedLevel?.id ?? quizLevel}
              explorationPoints={levelExplorationPoints}
              coinsEarned={levelCoinsCollected}
              xpEarned={completedLevels.includes(selectedLevel?.id ?? quizLevel) ? 0 : 100}
              onFinish={(result) => handleLevelComplete(selectedLevel?.id ?? quizLevel, result)}
              onRetry={() => {
                setLevelExplorationPoints(0);
                setLevelCoinsCollected(0);
                setActiveTab('game');
              }}
            />
          )}

          {/* TAB CONTENT: PRESTASI VIEW */}
          {activeTab === 'prestasi' && <PrestasiView />}

          {/* TAB CONTENT: PROFIL VIEW */}
          {activeTab === 'profil' && (
            <ProfilView
              studentName={studentName}
              level={level}
              stars={stars}
              gems={gems}
              xp={xp}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* Bottom Navigation Bar */}
          {activeTab !== 'level' && activeTab !== 'game' && activeTab !== 'soal' && (
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          )}

          {/* ================= MODAL OVERLAYS ================= */}
          {/* Kenali Bangun Datar Modal */}
          {isShapesOpen && (
            <ShapesModal
              onClose={() => {
                setIsShapesOpen(false);
                if (activeTab === 'materi') {
                  setActiveTab('beranda');
                }
              }}
            />
          )}

          {/* Mulai Petualangan Quiz Mini-Game Modal */}
          {isQuizOpen && (
            <QuizModal
              initialLevel={quizLevel}
              onClose={() => {
                setIsQuizOpen(false);
                if (activeTab === 'level') {
                  setActiveTab('peta');
                }
              }}
              onRewardStars={handleRewardStars}
            />
          )}

          {/* Daily Mission Modal */}
          {isMissionOpen && (
            <MissionModal
              onClose={() => setIsMissionOpen(false)}
              onClaimReward={(amt) => handleRewardStars(amt)}
            />
          )}

          {/* Shop Modal */}
          {shopTab && (
            <ShopModal
              initialTab={shopTab}
              onClose={() => setShopTab(null)}
              onAddCurrency={handleAddCurrency}
            />
          )}

          {/* Settings Modal */}
          {isSettingsOpen && (
            <SettingsModal
              studentName={studentName}
              onClose={() => setIsSettingsOpen(false)}
              onUpdateName={(name) => setStudentName(name)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
