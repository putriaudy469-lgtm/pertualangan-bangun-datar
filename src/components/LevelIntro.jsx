import { playClick } from '../utils/audio';

export default function LevelIntro({ level, stars, gems, onBack, onStart }) {
  return (
    <section className="level-intro-view" aria-label={`Detail Level ${level.id}`}>
      <img className="level-intro-background" src="/level-background.png" alt="" />

      <button
        className="level-intro-back"
        onClick={() => {
          playClick();
          onBack();
        }}
        aria-label="Kembali ke peta"
      >
        ‹
      </button>

      <div className="level-intro-currency" aria-label={`${stars} bintang, ${gems} koin`}>
        <span><span aria-hidden="true">⭐</span>{stars}</span>
        <span><span className="level-intro-coin" aria-hidden="true">●</span>{gems}</span>
      </div>

      <header className="level-intro-title">
        <h1>Level {level.id}</h1>
      </header>
      <p className="level-intro-gate">{level.gate}</p>

      <section className="level-intro-objective" aria-labelledby="level-objective-title">
        <h2 id="level-objective-title">Tujuan:</h2>
        <p>{level.purpose}</p>
      </section>

      <div className="level-intro-rating" aria-label="Nilai maksimal: 3 bintang">
        <span aria-hidden="true">★</span>
        <span aria-hidden="true">★</span>
        <span aria-hidden="true">★</span>
      </div>

      <div className="level-intro-details">
        <span><span aria-hidden="true">◷</span> 3-5 menit</span>
        <span><span aria-hidden="true">◎</span> 3 tantangan</span>
      </div>

      <img
        className="level-intro-mascot"
        src="/adventure-mascot.png"
        alt="Maskot segitiga petualang"
      />

      <button
        className="level-intro-start"
        onClick={() => {
          playClick();
          onStart();
        }}
      >
        Mulai
      </button>
    </section>
  );
}
