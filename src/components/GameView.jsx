import { useCallback, useEffect, useRef, useState } from 'react';
import { playBounce, playClick, playCoin } from '../utils/audio';

const COLLECTIBLES = [
  { id: 1, shape: 'triangle', left: 23, top: 58 },
  { id: 2, shape: 'square', left: 45, top: 48 },
  { id: 3, shape: 'circle', left: 10, top: 39 },
  { id: 4, shape: 'square', left: 72, top: 30 },
  { id: 5, shape: 'triangle', left: 88, top: 30 },
];

const COINS = [
  { id: 1, left: 23, top: 60 },
  { id: 2, left: 52, top: 50 },
  { id: 3, left: 94, top: 32 },
];

const PLATFORMS = [
  { id: 1, left: 0, right: 28, center: 14, width: 36, top: 62, image: '/game-island-lower.png', artOffset: 12 },
  { id: 2, left: 33, right: 59, center: 45, width: 30, top: 52, image: '/game-island-left.png', artOffset: 5 },
  { id: 3, left: 0, right: 16, center: 5, width: 28, top: 43, image: '/game-island-left.png', artOffset: 5 },
  { id: 4, left: 54, right: 100, center: 80, width: 44, top: 34, image: '/game-island-right-clean.png', artOffset: 36 },
];
const GRAVITY = 1900;

function ShapeIcon({ shape }) {
  if (shape === 'triangle') {
    return <span className="game-shape-icon triangle" aria-hidden="true" />;
  }
  if (shape === 'square') {
    return <span className="game-shape-icon square" aria-hidden="true" />;
  }
  return <span className="game-shape-icon circle" aria-hidden="true" />;
}

export default function GameView({
  gems,
  explorationPoints = 0,
  onBack,
  onFinish,
  onAddGem,
  onAddExplorationPoints,
  onResetExplorationPoints,
}) {
  const [player, setPlayer] = useState({ x: 12, y: 0, grounded: false });
  const [enemyX, setEnemyX] = useState(51);
  const [collected, setCollected] = useState(() => new Set());
  const [collectedCoins, setCollectedCoins] = useState(() => new Set());
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const [toast, setToast] = useState('');
  const worldRef = useRef(null);
  const playerRef = useRef({ x: 12, y: null, velocityY: 0, grounded: false });
  const enemyRef = useRef({ x: 51, direction: 1 });
  const heldDirection = useRef(0);
  const keysDown = useRef(new Set());
  const collectedRef = useRef(new Set());
  const collectedCoinsRef = useRef(new Set());
  const livesRef = useRef(3);
  const checkpointRef = useRef({ x: 12, top: PLATFORMS[0].top });
  const pausedRef = useRef(false);
  const invulnerableUntil = useRef(0);
  const toastTimer = useRef(null);
  const invulnerabilityTimer = useRef(null);
  const callbacks = useRef({
    onAddGem,
    onAddExplorationPoints,
    onResetExplorationPoints,
    onBack,
    onFinish,
  });
  const isComplete = collected.size === COLLECTIBLES.length;
  const isGameOver = lives === 0;

  useEffect(() => {
    callbacks.current = {
      onAddGem,
      onAddExplorationPoints,
      onResetExplorationPoints,
      onBack,
      onFinish,
    };
    pausedRef.current = isPaused;
    livesRef.current = lives;
  }, [isPaused, lives, onAddGem, onAddExplorationPoints, onResetExplorationPoints, onBack, onFinish]);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 1500);
  }, []);

  const respawnAtCheckpoint = useCallback((bounds, time, message) => {
    const position = playerRef.current;
    const checkpoint = checkpointRef.current;
    position.x = checkpoint.x;
    position.y = bounds.height * (checkpoint.top / 100);
    position.velocityY = 0;
    position.grounded = true;
    invulnerableUntil.current = time + 1400;
    setIsInvulnerable(true);
    window.clearTimeout(invulnerabilityTimer.current);
    invulnerabilityTimer.current = window.setTimeout(() => setIsInvulnerable(false), 1400);

    const remainingLives = Math.max(0, livesRef.current - 1);
    const nextLives = remainingLives === 0 ? 3 : remainingLives;
    livesRef.current = nextLives;
    setLives(nextLives);
    playBounce();
    showToast(`${message} Kembali ke checkpoint.${remainingLives === 0 ? ' Nyawa dipulihkan.' : ''}`);
  }, [showToast]);

  const jump = useCallback(() => {
    if (pausedRef.current || livesRef.current === 0 || !playerRef.current.grounded) return;
    playerRef.current.grounded = false;
    const worldHeight = worldRef.current?.getBoundingClientRect().height ?? 0;
    const jumpHeight = Math.max(152, worldHeight * 0.22);
    playerRef.current.velocityY = -Math.sqrt(2 * GRAVITY * jumpHeight);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'arrowup', ' ', 'a', 'd', 'w'].includes(key)) {
        event.preventDefault();
      }
      if (keysDown.current.has(key)) return;
      keysDown.current.add(key);
      if (key === 'arrowup' || key === 'w' || key === ' ') jump();
    };

    const handleKeyUp = (event) => keysDown.current.delete(event.key.toLowerCase());
    const releaseControls = () => {
      heldDirection.current = 0;
      keysDown.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseControls);
    window.addEventListener('pointerup', releaseControls);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseControls);
      window.removeEventListener('pointerup', releaseControls);
      window.clearTimeout(toastTimer.current);
      window.clearTimeout(invulnerabilityTimer.current);
    };
  }, [jump]);

  useEffect(() => {
    if (isPaused || isComplete || isGameOver) return undefined;

    let frameId;
    let previousTime = 0;
    let lastRenderTime = 0;

    const tick = (time) => {
      const delta = Math.min((time - (previousTime || time)) / 1000, 0.04);
      previousTime = time;
      const bounds = worldRef.current?.getBoundingClientRect();
      if (!bounds) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      const movement = heldDirection.current
        || (keysDown.current.has('arrowleft') || keysDown.current.has('a') ? -1 : 0)
        || (keysDown.current.has('arrowright') || keysDown.current.has('d') ? 1 : 0);
      const position = playerRef.current;
      position.x = Math.min(94, Math.max(6, position.x + movement * (delta * 42)));
      if (position.y === null) {
        position.y = bounds.height * (PLATFORMS[0].top / 100);
        position.grounded = true;
      }

      const previousY = position.y;
      position.y += position.velocityY * delta;
      position.velocityY += GRAVITY * delta;
      if (position.velocityY >= 0) {
        const platform = PLATFORMS.find((candidate) =>
          previousY <= bounds.height * (candidate.top / 100)
          && position.y >= bounds.height * (candidate.top / 100)
          && position.x >= candidate.left - 3
          && position.x <= candidate.right + 3
        );
        if (platform) {
          position.y = bounds.height * (platform.top / 100);
          position.velocityY = 0;
          position.grounded = true;
          checkpointRef.current = { x: position.x, top: platform.top };
        } else {
          position.grounded = false;
        }
      } else {
        position.grounded = false;
      }

      if (position.y > bounds.height * 1.05) {
        respawnAtCheckpoint(bounds, time, 'Ups, jatuh!');
      }

      const playerX = bounds.width * position.x / 100;
      const playerY = position.y - bounds.height * 0.08;

      COLLECTIBLES.forEach((item) => {
        if (collectedRef.current.has(item.id)) return;
        const itemX = bounds.width * item.left / 100;
        const itemY = bounds.height * item.top / 100;
        if (Math.abs(playerX - itemX) < 34 && Math.abs(playerY - itemY) < 48) {
          collectedRef.current.add(item.id);
          setCollected(new Set(collectedRef.current));
          callbacks.current.onAddExplorationPoints?.(10);
          playCoin();
          showToast(`${item.shape === 'triangle' ? 'Segitiga' : item.shape === 'square' ? 'Persegi' : 'Lingkaran'} didapat! +10 poin`);
        }
      });

      COINS.forEach((coin) => {
        if (collectedCoinsRef.current.has(coin.id)) return;
        const coinX = bounds.width * coin.left / 100;
        const coinY = bounds.height * coin.top / 100;
        if (Math.abs(playerX - coinX) < 30 && Math.abs(playerY - coinY) < 40) {
          collectedCoinsRef.current.add(coin.id);
          setCollectedCoins(new Set(collectedCoinsRef.current));
          callbacks.current.onAddGem?.(1);
          playCoin();
          showToast('+1 koin!');
        }
      });

      const enemy = enemyRef.current;
      enemy.x += enemy.direction * delta * 15;
      if (enemy.x > 86 || enemy.x < 14) enemy.direction *= -1;
      const enemyXPosition = bounds.width * enemy.x / 100;
      const enemyYPosition = bounds.height * (PLATFORMS[0].top / 100) - bounds.height * 0.08;
      if (
        movement !== 0
        && time > invulnerableUntil.current
        && Math.abs(playerX - enemyXPosition) < 43
        && Math.abs(playerY - enemyYPosition) < 60
      ) {
        invulnerableUntil.current = time + 1400;
        setIsInvulnerable(true);
        window.clearTimeout(invulnerabilityTimer.current);
        invulnerabilityTimer.current = window.setTimeout(() => setIsInvulnerable(false), 1400);
        respawnAtCheckpoint(bounds, time, 'Awas lebah!');
      }

      if (time - lastRenderTime > 30) {
        setPlayer({ x: position.x, y: position.y, grounded: position.grounded });
        setEnemyX(enemy.x);
        lastRenderTime = time;
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isComplete, isGameOver, isPaused, respawnAtCheckpoint, showToast]);

  const beginMoveLeft = useCallback((event) => {
    event.preventDefault();
    heldDirection.current = -1;
  }, []);

  const beginMoveRight = useCallback((event) => {
    event.preventDefault();
    heldDirection.current = 1;
  }, []);

  const handlePause = () => {
    playClick();
    setIsPaused(true);
  };

  const handleBack = () => {
    playClick();
    callbacks.current.onBack?.();
  };

  const handleRestart = () => {
    playClick();
    callbacks.current.onResetExplorationPoints?.();
    playerRef.current = { x: 12, y: null, velocityY: 0, grounded: false };
    enemyRef.current = { x: 51, direction: 1 };
    checkpointRef.current = { x: 12, top: PLATFORMS[0].top };
    collectedRef.current.clear();
    collectedCoinsRef.current.clear();
    livesRef.current = 3;
    invulnerableUntil.current = 0;
    window.clearTimeout(invulnerabilityTimer.current);
    setPlayer({ x: 12, y: 0, grounded: false });
    setEnemyX(51);
    setCollected(new Set());
    setCollectedCoins(new Set());
    setLives(3);
    setIsPaused(false);
    setIsInvulnerable(false);
    setToast('');
  };

  return (
    <section className="game-view" aria-label="Permainan kumpulkan bentuk" ref={worldRef}>
      <img className="game-background" src="/gameplay-background.png" alt="" />

      <button className="game-pause-button" onClick={handlePause} aria-label="Jeda permainan">
        Ⅱ
      </button>

      <div className="game-currency" aria-label={`${explorationPoints} poin dan ${gems} koin`}>
        <span className="game-point-count" aria-live="polite">
          <span aria-hidden="true">★</span>{explorationPoints} poin
        </span>
        <span className="game-coin-count"><span aria-hidden="true">●</span>{gems}</span>
      </div>

      <header className="game-objective">
        <div className="game-objective-copy">
          <strong>Kumpulkan semua bentuk!</strong>
          <small>Lompat untuk mengambil bentuk, hindari lebah!</small>
        </div>
        <div className="game-objective-row">
          <span className={`game-objective-shape${collected.has(1) || collected.has(4) ? ' collected' : ''}`}><ShapeIcon shape="triangle" /></span>
          <span className={`game-objective-shape${collected.has(2) || collected.has(5) ? ' collected' : ''}`}><ShapeIcon shape="square" /></span>
          <span className={`game-objective-shape${collected.has(3) ? ' collected' : ''}`}><ShapeIcon shape="circle" /></span>
          <span className="game-collect-count" aria-live="polite">{collected.size}/{COLLECTIBLES.length}</span>
        </div>
      </header>

      <div className="game-world" aria-label="Area permainan">
        {PLATFORMS.map((platform) => (
          <img
            key={`platform-${platform.id}`}
            className="game-platform"
            src={platform.image}
            alt=""
            draggable="false"
            style={{
              left: `${platform.center}%`,
              top: `${platform.top}%`,
              width: `${platform.width}%`,
              transform: `translate(-50%, -${platform.artOffset}%)`,
            }}
          />
        ))}
        {COINS.map((coin) => (
          !collectedCoins.has(coin.id) && (
            <div
              key={`coin-${coin.id}`}
              className="game-bonus-coin"
              style={{ left: `${coin.left}%`, top: `${coin.top}%` }}
              aria-label="Koin bonus"
            >
              ●
            </div>
          )
        ))}
        {COLLECTIBLES.map((item) => (
          !collected.has(item.id) && (
            <div
              key={item.id}
              className="game-collectible"
              style={{ left: `${item.left}%`, top: `${item.top}%` }}
              aria-label={`Bentuk ${item.shape}`}
            >
              <ShapeIcon shape={item.shape} />
            </div>
          )
        ))}
        <span
          className="game-enemy"
          style={{ left: `${enemyX}%` }}
          aria-label="Lebah pengganggu"
          role="img"
        >
          🐝
        </span>
        <img
          className={`game-player${!player.grounded ? ' jumping' : ''}${isInvulnerable ? ' invulnerable' : ''}`}
          src="/adventure-mascot.png"
          alt="Segitiga petualang"
          style={{ left: `${player.x}%`, top: `${player.y + 12}px` }}
        />
      </div>

      <div className="game-controls" aria-label="Kontrol permainan">
        <button
          onPointerDown={beginMoveLeft}
          aria-label="Bergerak ke kiri"
        >
          ←
        </button>
        <button
          onPointerDown={beginMoveRight}
          aria-label="Bergerak ke kanan"
        >
          →
        </button>
        <button className="game-jump-button" onPointerDown={(event) => { event.preventDefault(); jump(); }} aria-label="Lompat">
          ↑
        </button>
      </div>

      <div className="game-lives" aria-label={`${lives} nyawa tersisa`}>
        {Array.from({ length: 3 }, (_, index) => (
          <span key={index} className={index < lives ? 'life-active' : 'life-lost'} aria-hidden="true">♥</span>
        ))}
      </div>

      {toast && !isComplete && !isGameOver && (
        <div className="game-toast" key={toast} role="status">{toast}</div>
      )}

      {(isPaused || isComplete || isGameOver) && (
        <div className="game-overlay">
          <section className="game-overlay-card" aria-live="polite">
            <h2>
              {isComplete ? 'Hebat, semua terkumpul!' : isGameOver ? 'Coba lagi, ya!' : 'Permainan dijeda'}
            </h2>
            <p>
              {isComplete
                ? 'Kamu berhasil mengumpulkan semua bentuk!'
                : isGameOver
                  ? `Kamu mengumpulkan ${collected.size} dari ${COLLECTIBLES.length} bentuk.`
                  : 'Istirahat sebentar sebelum melanjutkan petualangan.'}
            </p>
            {isComplete ? (
              <button
                className="game-overlay-primary"
                onClick={() => {
                  playClick();
                  callbacks.current.onFinish?.();
                }}
              >
                Selesai
              </button>
            ) : isGameOver ? (
              <>
                <button className="game-overlay-primary" onClick={handleRestart}>Main Lagi</button>
                <button className="game-overlay-secondary" onClick={handleBack}>Kembali ke Level</button>
              </>
            ) : (
              <>
                <button
                  className="game-overlay-primary"
                  onClick={() => {
                    playClick();
                    setIsPaused(false);
                  }}
                >
                  Lanjutkan
                </button>
                <button className="game-overlay-secondary" onClick={handleBack}>
                  Kembali ke Level
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
