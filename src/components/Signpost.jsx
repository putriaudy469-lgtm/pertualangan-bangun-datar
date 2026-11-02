import { playClick } from '../utils/audio';

export default function Signpost({ onClick }) {
  const handleClick = (e) => {
    playClick();
    onClick?.(e);
  };

  return (
    <div
      className="signpost-wrapper"
      onClick={handleClick}
      title="Klik untuk Belajar Mengenal Macam Bangun Datar"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
    >
      <img
        src="/signpost_clean.png"
        alt="Kenali Bangun Datar"
        className="signpost-clean-img"
      />
    </div>
  );
}
