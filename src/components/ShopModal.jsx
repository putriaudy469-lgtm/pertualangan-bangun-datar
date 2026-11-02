import { useState } from 'react';
import { playClick, playCoin } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

export default function ShopModal({ initialTab = 'star', onClose, onAddCurrency }) {
  const [tab, setTab] = useState(initialTab);

  const starItems = [
    { id: 1, name: 'Pundi Bintang Mini', amount: '+30 Bintang', price: 'Gratis Hadiah Harian', type: 'star', gain: 30 },
    { id: 2, name: 'Kantong Bintang Emas', amount: '+100 Bintang', price: 'Tukar 10 Permata', type: 'star', gain: 100 },
    { id: 3, name: 'Peti Harta Karun Bintang', amount: '+250 Bintang', price: 'Tukar 20 Permata', type: 'star', gain: 250 },
  ];

  const gemItems = [
    { id: 4, name: 'Permata Berkilau', amount: '+10 Permata', price: 'Tugas Sempurna', type: 'gem', gain: 10 },
    { id: 5, name: 'Kantung Safir Biru', amount: '+25 Permata', price: 'Capai Level 5', type: 'gem', gain: 25 },
  ];

  const handleBuy = (item) => {
    playCoin();
    launchConfetti();
    onAddCurrency?.(item.type, item.gain);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">Toko Petualang</span>
            <h2 className="modal-title">Dapatkan Bintang & Permata</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="shop-tab-row">
          <button
            className={`shop-tab-btn ${tab === 'star' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setTab('star');
            }}
          >
            ⭐ Bintang
          </button>
          <button
            className={`shop-tab-btn ${tab === 'gem' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setTab('gem');
            }}
          >
            💎 Permata
          </button>
        </div>

        <div className="shop-items-grid">
          {(tab === 'star' ? starItems : gemItems).map((item) => (
            <div key={item.id} className="shop-item-card">
              <div className="shop-item-icon">{item.type === 'star' ? '⭐' : '💎'}</div>
              <div className="shop-item-name">{item.name}</div>
              <div className="shop-item-amount">{item.amount}</div>
              <button className="shop-buy-btn" onClick={() => handleBuy(item)}>
                {item.price}
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="action-btn-secondary" onClick={onClose}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
