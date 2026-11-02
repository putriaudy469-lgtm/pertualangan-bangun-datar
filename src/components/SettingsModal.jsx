import { useState } from 'react';
import { playClick, isAudioEnabled, setAudioEnabled } from '../utils/audio';

export default function SettingsModal({ onClose, studentName, onUpdateName }) {
  const [audioOn, setAudioOn] = useState(isAudioEnabled());
  const [bgmOn, setBgmOn] = useState(true);
  const [nameInput, setNameInput] = useState(studentName);
  const [isEditing, setIsEditing] = useState(false);

  const toggleSound = () => {
    playClick();
    const next = !audioOn;
    setAudioOn(next);
    setAudioEnabled(next);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName?.(nameInput.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">Preferensi</span>
            <h2 className="modal-title">Pengaturan Game</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-body">
          {/* Profile Name */}
          <div className="setting-row">
            <div className="setting-label">
              <span className="setting-title">Nama Siswa</span>
              <span className="setting-desc">Nama yang tampil di profil petualang</span>
            </div>
            {isEditing ? (
              <div className="name-edit-box">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="setting-input"
                  maxLength={15}
                />
                <button className="btn-small save" onClick={handleSaveName}>
                  Simpan
                </button>
              </div>
            ) : (
              <button className="btn-small outline" onClick={() => setIsEditing(true)}>
                {studentName} ✏️
              </button>
            )}
          </div>

          {/* Sound FX */}
          <div className="setting-row">
            <div className="setting-label">
              <span className="setting-title">Efek Suara (SFX)</span>
              <span className="setting-desc">Suara klik, bintang koin, dan lonceng benar</span>
            </div>
            <button
              className={`toggle-switch ${audioOn ? 'on' : 'off'}`}
              onClick={toggleSound}
              aria-label="Efek Suara"
            >
              <div className="toggle-thumb"></div>
            </button>
          </div>

          {/* BGM */}
          <div className="setting-row">
            <div className="setting-label">
              <span className="setting-title">Musik Petualangan (BGM)</span>
              <span className="setting-desc">Musik riang latar belakang</span>
            </div>
            <button
              className={`toggle-switch ${bgmOn ? 'on' : 'off'}`}
              onClick={() => {
                playClick();
                setBgmOn(!bgmOn);
              }}
              aria-label="Musik Latar"
            >
              <div className="toggle-thumb"></div>
            </button>
          </div>

          {/* About */}
          <div className="about-app-box">
            <h4>Tentang Aplikasi:</h4>
            <p>
              <strong>Petualangan Bangun Datar</strong> adalah media pembelajaran interaktif matematika
              bangun datar berbasis web mobile untuk siswa sekolah dasar.
            </p>
            <p className="app-version">Versi 1.0.0 • Pemrograman Mobile</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn-primary" onClick={onClose}>
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
