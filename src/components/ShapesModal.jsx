import { useState } from 'react';
import { playClick, playSuccess } from '../utils/audio';

const SHAPES_DATA = [
  {
    id: 'segitiga',
    name: 'Segitiga',
    tagline: 'Bangun Datar 3 Sisi & 3 Sudut',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    svg: (
      <svg viewBox="0 0 100 100" className="shape-preview-svg">
        <polygon points="50,15 88,85 12,85" fill="#fcd34d" stroke="#f59e0b" strokeWidth="6" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Segitiga dibentuk oleh 3 sisi dan memiliki 3 titik sudut. Total ketiga sudutnya selalu tepat 180°!',
    properties: [
      'Mempunyai 3 sisi dan 3 titik sudut',
      'Total sudut segitiga = 180°',
      'Jenis: Sama Sisi, Sama Kaki, Siku-Siku, Sembarang',
    ],
    formulas: [
      { label: 'Luas', formula: 'L = ½ × alas × tinggi' },
      { label: 'Keliling', formula: 'K = sisi₁ + sisi₂ + sisi₃' },
    ],
    calcType: 'triangle',
  },
  {
    id: 'persegi',
    name: 'Persegi',
    tagline: '4 Sisi Sama Panjang & 4 Sudut Siku-Siku',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    svg: (
      <svg viewBox="0 0 100 100" className="shape-preview-svg">
        <rect x="20" y="20" width="60" height="60" rx="6" fill="#93c5fd" stroke="#3b82f6" strokeWidth="6" />
      </svg>
    ),
    description: 'Persegi adalah bangun datar 4 sisi sama panjang dan keempat sudutnya merupakan sudut siku-siku (90°).',
    properties: [
      'Semua sisi berukuran sama panjang',
      'Keempat sudutnya siku-siku 90°',
      'Memiliki 4 sumbu simetri lipat dan putar',
    ],
    formulas: [
      { label: 'Luas', formula: 'L = sisi × sisi (s²)' },
      { label: 'Keliling', formula: 'K = 4 × sisi' },
    ],
    calcType: 'square',
  },
  {
    id: 'persegi_panjang',
    name: 'Persegi Panjang',
    tagline: 'Sisi Berhadapan Sama & Sudut 90°',
    color: '#10b981',
    bgColor: '#ecfdf5',
    svg: (
      <svg viewBox="0 0 100 100" className="shape-preview-svg">
        <rect x="12" y="28" width="76" height="44" rx="6" fill="#6ee7b7" stroke="#10b981" strokeWidth="6" />
      </svg>
    ),
    description: 'Memiliki 2 pasang sisi sejajar yang sama panjang (panjang & lebar) serta 4 sudut siku-siku.',
    properties: [
      'Sisi yang berhadapan sama panjang dan sejajar',
      'Keempat sudutnya siku-siku 90°',
      'Memiliki 2 simetri lipat & 2 simetri putar',
    ],
    formulas: [
      { label: 'Luas', formula: 'L = panjang × lebar' },
      { label: 'Keliling', formula: 'K = 2 × (panjang + lebar)' },
    ],
    calcType: 'rectangle',
  },
  {
    id: 'lingkaran',
    name: 'Lingkaran',
    tagline: 'Garis Lengkung Berjarak Sama ke Pusat',
    color: '#ef4444',
    bgColor: '#fef2f2',
    svg: (
      <svg viewBox="0 0 100 100" className="shape-preview-svg">
        <circle cx="50" cy="50" r="35" fill="#fca5a5" stroke="#ef4444" strokeWidth="6" />
      </svg>
    ),
    description: 'Bangun datar yang dibentuk oleh himpunan semua titik yang berjarak sama ke suatu titik pusat (jari-jari).',
    properties: [
      'Hanya memiliki 1 sisi lengkung melingkar',
      'Tidak memiliki titik sudut sama sekali',
      'Memiliki simetri lipat & putar tak terhingga',
    ],
    formulas: [
      { label: 'Luas', formula: 'L = π × r² (π = 3,14 atau ²²⁄₇)' },
      { label: 'Keliling', formula: 'K = 2 × π × r atau π × d' },
    ],
    calcType: 'circle',
  },
  {
    id: 'trapesium',
    name: 'Trapesium',
    tagline: 'Segiempat dengan Sepasang Sisi Sejajar',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    svg: (
      <svg viewBox="0 0 100 100" className="shape-preview-svg">
        <polygon points="30,25 70,25 85,75 15,75" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="6" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Bangun datar segiempat yang memiliki tepat sepasang sisi yang sejajar namun tidak sama panjang.',
    properties: [
      'Memiliki 1 pasang sisi sejajar',
      'Jumlah sudut yang berdekatan di antara sisi sejajar adalah 180°',
      'Jenis: Trapesium Sama Kaki, Siku-Siku, Sembarang',
    ],
    formulas: [
      { label: 'Luas', formula: 'L = ½ × (sisi atas + sisi bawah) × tinggi' },
      { label: 'Keliling', formula: 'K = Jumlah seluruh sisi' },
    ],
    calcType: 'trapezoid',
  },
];

export default function ShapesModal({ onClose }) {
  const [selectedShape, setSelectedShape] = useState(SHAPES_DATA[0]);
  const [inputA, setInputA] = useState(6);
  const [inputB, setInputB] = useState(8);

  const calculate = () => {
    const a = parseFloat(inputA) || 0;
    const b = parseFloat(inputB) || 0;
    if (selectedShape.calcType === 'triangle') {
      return { luas: 0.5 * a * b, unit: 'cm²' };
    }
    if (selectedShape.calcType === 'square') {
      return { luas: a * a, keliling: 4 * a, unit: 'cm' };
    }
    if (selectedShape.calcType === 'rectangle') {
      return { luas: a * b, keliling: 2 * (a + b), unit: 'cm' };
    }
    if (selectedShape.calcType === 'circle') {
      return { luas: (3.14 * a * a).toFixed(2), keliling: (2 * 3.14 * a).toFixed(2), unit: 'cm' };
    }
    return { luas: 0.5 * (a + b) * 5, unit: 'cm²' };
  };

  const result = calculate();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container shapes-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">Modul Edukasi</span>
            <h2 className="modal-title">Kenali Bangun Datar</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>

        {/* Shape Tabs */}
        <div className="shapes-tab-scroller">
          {SHAPES_DATA.map((shape) => (
            <button
              key={shape.id}
              className={`shape-pill-tab ${selectedShape.id === shape.id ? 'active' : ''}`}
              style={{
                borderColor: selectedShape.id === shape.id ? shape.color : 'transparent',
              }}
              onClick={() => {
                playClick();
                setSelectedShape(shape);
              }}
            >
              {shape.name}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="shape-detail-card" style={{ backgroundColor: selectedShape.bgColor }}>
          <div className="shape-hero-row">
            <div className="shape-svg-box">{selectedShape.svg}</div>
            <div className="shape-info">
              <h3 className="shape-name" style={{ color: selectedShape.color }}>
                {selectedShape.name}
              </h3>
              <p className="shape-tagline">{selectedShape.tagline}</p>
              <p className="shape-desc">{selectedShape.description}</p>
            </div>
          </div>

          {/* Properties list */}
          <div className="properties-section">
            <h4 className="section-label">Ciri & Sifat:</h4>
            <ul className="prop-list">
              {selectedShape.properties.map((prop, idx) => (
                <li key={idx} className="prop-item">
                  <span className="prop-bullet" style={{ color: selectedShape.color }}>
                    ✦
                  </span>
                  {prop}
                </li>
              ))}
            </ul>
          </div>

          {/* Formulas */}
          <div className="formulas-section">
            <h4 className="section-label">Rumus Matematika:</h4>
            <div className="formula-chips">
              {selectedShape.formulas.map((f, idx) => (
                <div key={idx} className="formula-chip">
                  <span className="formula-label">{f.label}:</span>
                  <span className="formula-code">{f.formula}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Calculator */}
          <div className="interactive-calc-box">
            <h4 className="calc-title">Kalkulator Interaktif {selectedShape.name}:</h4>
            <div className="calc-inputs-row">
              <label className="input-group">
                <span>{selectedShape.calcType === 'circle' ? 'Jari-jari (r)' : 'Nilai (a/sisi):'}</span>
                <input
                  type="number"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                  min="1"
                  max="100"
                />
              </label>

              {selectedShape.calcType !== 'square' && selectedShape.calcType !== 'circle' && (
                <label className="input-group">
                  <span>{selectedShape.calcType === 'triangle' ? 'Tinggi (t):' : 'Lebar (l/b):'}</span>
                  <input
                    type="number"
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    min="1"
                    max="100"
                  />
                </label>
              )}
            </div>

            <div className="calc-result-badge">
              <span>Hasil Luas = <strong>{result.luas} cm²</strong></span>
              {result.keliling && (
                <span> | Keliling = <strong>{result.keliling} cm</strong></span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="action-btn-primary"
            onClick={() => {
              playSuccess();
              onClose();
            }}
          >
            Paham! Mulai Kuis Bangun Datar 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
