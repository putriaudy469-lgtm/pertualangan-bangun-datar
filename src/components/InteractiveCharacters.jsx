import { useState } from 'react';
import { playBounce } from '../utils/audio';

export default function InteractiveCharacters() {
  const [activeSpeech, setActiveSpeech] = useState(null);

  const handleCharacterClick = (id, text) => {
    playBounce();
    setActiveSpeech({ id, text });
    setTimeout(() => {
      setActiveSpeech((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  return (
    <div className="interactive-characters-layer">
      {/* Speech Bubble popup */}
      {activeSpeech && (
        <div className={`speech-bubble bubble-${activeSpeech.id}`}>
          <div className="bubble-text">{activeSpeech.text}</div>
          <div className="bubble-tail"></div>
        </div>
      )}

      <div
        className="hero-character-sprite-container"
        onClick={() =>
          handleCharacterClick(
            'hero',
            '🌟 Halo Rizki! Aku Tio si Segitiga! Jumlah ketiga sudutku selalu 180°!'
          )
        }
        title="Klik Tio si Segitiga!"
      >
      </div>

      <button
        className="character-hitbox red-circle-hitbox"
        onClick={() =>
          handleCharacterClick(
            'red',
            'Aku Boni si Lingkaran! Aku mulus tanpa sudut siku-siku!'
          )
        }
        aria-label="Boni si Lingkaran"
        title="Klik Boni si Lingkaran!"
      />
      <button
        className="character-hitbox blue-square-hitbox"
        onClick={() =>
          handleCharacterClick(
            'blue',
            'Aku Kiko si Persegi! Empat sisiku sama panjang!'
          )
        }
        aria-label="Kiko si Persegi"
        title="Klik Kiko si Persegi!"
      />
      <button
        className="character-hitbox purple-pyramid-hitbox"
        onClick={() =>
          handleCharacterClick(
            'purple',
            'Aku Pipi si Limas Segitiga! Bangun ruang yang anggun!'
          )
        }
        aria-label="Pipi si Limas"
        title="Klik Pipi si Limas!"
      />
    </div>
  );
}
