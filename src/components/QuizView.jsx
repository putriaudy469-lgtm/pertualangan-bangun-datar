import { useState } from 'react';
import { playClick, playSuccess, playBounce } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

const question = (prompt, choices, correct, hint, picture, pictureLabels) => ({
  prompt,
  choices: choices.map((choice) => (typeof choice === 'string' ? { label: choice } : choice)),
  correct: [correct],
  hint,
  picture,
  pictureLabels,
});

const QUESTIONS = [
  [
    question('Atap rumah pada gambar ini berbentuk apa?', [
      { label: 'Segitiga', shape: 'triangle' }, { label: 'Persegi', shape: 'square' },
      { label: 'Persegi Panjang', shape: 'rectangle' }, { label: 'Lingkaran', shape: 'circle' },
    ], 0, 'Atap rumah memiliki tiga sisi. Bentuk dengan tiga sisi adalah segitiga.', 'house'),
    question('Bangun datar yang memiliki tiga sisi adalah ...', ['Lingkaran', 'Segitiga', 'Persegi', 'Persegi panjang'], 1, 'Segitiga memiliki tiga sisi.'),
    question('Bentuk koin jika dilihat dari depan menyerupai ...', ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], 2, 'Koin berbentuk bulat seperti lingkaran.', 'objects'),
    question('Berapa banyak sisi yang dimiliki persegi panjang?', ['3 sisi', '4 sisi', '5 sisi', '6 sisi'], 1, 'Persegi panjang memiliki empat sisi.', 'rectangle'),
    question('Bangun datar yang tidak memiliki titik sudut adalah ...', ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], 2, 'Lingkaran tidak memiliki titik sudut.', 'circle-radius'),
  ],
  [
    question('Benda mana yang memiliki bentuk lingkaran?', [
      { label: 'Bola', icon: '⚽' }, { label: 'Buku', icon: '📘' },
      { label: 'Dadu', icon: '🎲' }, { label: 'Penggaris', icon: '📏' },
    ], 0, 'Bola berbentuk bundar seperti lingkaran.', 'objects'),
    question('Bangun datar yang memiliki empat sisi sama panjang adalah ...', ['Segitiga', 'Lingkaran', 'Persegi', 'Persegi panjang'], 2, 'Persegi memiliki empat sisi sama panjang.', 'square'),
    question('Bentuk papan tulis biasanya menyerupai ...', ['Persegi panjang', 'Lingkaran', 'Segitiga', 'Oval'], 0, 'Papan tulis umumnya berbentuk persegi panjang.', 'rectangle'),
    question('Bangun datar mana yang memiliki satu sisi lengkung?', ['Persegi', 'Segitiga', 'Lingkaran', 'Persegi panjang'], 2, 'Lingkaran memiliki garis tepi yang melengkung.', 'circle-radius'),
    question('Berapa titik sudut yang dimiliki segitiga?', ['2 titik sudut', '3 titik sudut', '4 titik sudut', '5 titik sudut'], 1, 'Segitiga memiliki tiga titik sudut.', 'triangle'),
  ],
  [
    question('Berapa banyak titik sudut yang dimiliki persegi?', ['2 titik sudut', '3 titik sudut', '4 titik sudut', '5 titik sudut'], 2, 'Persegi memiliki empat pojok atau titik sudut.', 'square'),
    question('Semua sisi persegi memiliki panjang yang ...', ['Berbeda', 'Sama', 'Melengkung', 'Tidak beraturan'], 1, 'Keempat sisi persegi sama panjang.', 'square'),
    question('Sebuah persegi memiliki sisi 5 cm. Berapa kelilingnya?', ['10 cm', '15 cm', '20 cm', '25 cm'], 2, 'Keliling persegi = 4 × sisi, jadi 4 × 5 cm.', 'square'),
    question('Jika panjang sisi persegi 6 cm, kelilingnya adalah ...', ['12 cm', '18 cm', '24 cm', '36 cm'], 2, 'Keliling persegi = 4 × 6 cm = 24 cm.', 'square'),
    question('Keliling persegi 20 cm. Berapa panjang satu sisinya?', ['4 cm', '5 cm', '10 cm', '16 cm'], 1, 'Panjang sisi = keliling ÷ 4 = 20 ÷ 4 = 5 cm.', 'square'),
  ],
  [
    question('Bangun datar yang memiliki dua pasang sisi sejajar adalah ...', [
      { label: 'Lingkaran', shape: 'circle' }, { label: 'Persegi Panjang', shape: 'rectangle' },
      { label: 'Segitiga', shape: 'triangle' }, { label: 'Layang-layang', icon: '◇' },
    ], 1, 'Sisi berhadapan pada persegi panjang selalu sejajar.', 'rectangle'),
    question('Pada persegi panjang, sisi yang berhadapan memiliki panjang yang ...', ['Sama', 'Selalu berbeda', 'Melengkung', 'Tidak bisa diukur'], 0, 'Dua sisi yang berhadapan pada persegi panjang sama panjang.', 'rectangle'),
    question('Bangun datar segi empat memiliki berapa sisi?', ['3 sisi', '4 sisi', '5 sisi', '6 sisi'], 1, 'Segi empat memiliki empat sisi.'),
    question('Persegi memiliki berapa pasang sisi sejajar?', ['1 pasang', '2 pasang', '3 pasang', 'Tidak ada'], 1, 'Persegi memiliki dua pasang sisi yang sejajar.', 'square'),
    question('Berapa jumlah titik sudut persegi panjang?', ['2 titik sudut', '3 titik sudut', '4 titik sudut', '6 titik sudut'], 2, 'Persegi panjang memiliki empat titik sudut.', 'rectangle'),
  ],
  [
    question('Sebuah persegi memiliki sisi 5 cm. Berapa kelilingnya?', ['10 cm', '15 cm', '20 cm', '25 cm'], 2, 'Keliling persegi = 4 × 5 cm = 20 cm.', 'square'),
    question('Persegi panjang memiliki panjang 8 cm dan lebar 3 cm. Kelilingnya ...', ['11 cm', '16 cm', '22 cm', '24 cm'], 2, 'Keliling = 2 × (8 + 3) = 22 cm.', 'rectangle'),
    question('Keliling persegi dengan sisi 7 cm adalah ...', ['14 cm', '21 cm', '28 cm', '49 cm'], 2, 'Keliling persegi = 4 × 7 cm = 28 cm.', 'square'),
    question('Panjang persegi panjang 10 cm dan lebarnya 4 cm. Berapa kelilingnya?', ['14 cm', '24 cm', '28 cm', '40 cm'], 2, 'Keliling = 2 × (10 + 4) = 28 cm.', 'rectangle'),
    question('Keliling persegi panjang 18 cm. Jika panjangnya 5 cm, lebarnya ...', ['3 cm', '4 cm', '5 cm', '8 cm'], 1, '18 = 2 × (5 + lebar), jadi lebarnya 4 cm.', 'rectangle'),
  ],
  [
    question('Semua sisi persegi memiliki panjang yang ...', ['Berbeda', 'Sama', 'Melengkung', 'Tidak beraturan'], 1, 'Keempat sisi persegi sama panjang.', 'square'),
    question('Persegi panjang berukuran 8 cm × 4 cm. Berapa luasnya?', ['12 cm²', '24 cm²', '32 cm²', '40 cm²'], 2, 'Luas persegi panjang = panjang × lebar = 8 × 4 = 32 cm².', 'rectangle'),
    question('Luas persegi dengan sisi 5 cm adalah ...', ['10 cm²', '20 cm²', '25 cm²', '30 cm²'], 2, 'Luas persegi = sisi × sisi = 5 × 5 = 25 cm².', 'square'),
    question('Luas persegi panjang dengan panjang 9 cm dan lebar 2 cm adalah ...', ['11 cm²', '18 cm²', '22 cm²', '36 cm²'], 1, 'Luas = panjang × lebar = 9 × 2 = 18 cm².', 'rectangle'),
    question('Luas persegi 36 cm². Berapa panjang sisinya?', ['4 cm', '5 cm', '6 cm', '9 cm'], 2, 'Sisi persegi = √36 = 6 cm.', 'square'),
  ],
  [
    question('Segitiga memiliki sisi 5 cm, 5 cm, dan 8 cm. Apa jenisnya?', ['Segitiga sama sisi', 'Segitiga sama kaki', 'Segitiga sembarang', 'Segitiga siku-siku'], 1, 'Segitiga dengan dua sisi sama panjang disebut segitiga sama kaki.', 'triangle-sides', ['5 cm', '5 cm', '8 cm']),
    question('Segitiga dengan tiga sisi sama panjang disebut ...', ['Sama kaki', 'Sama sisi', 'Sembarang', 'Siku-siku'], 1, 'Segitiga sama sisi memiliki tiga sisi sama panjang.', 'triangle'),
    question('Segitiga yang memiliki satu sudut 90° disebut ...', ['Segitiga lancip', 'Segitiga tumpul', 'Segitiga siku-siku', 'Segitiga sama sisi'], 2, 'Sudut siku-siku besarnya 90°.', 'triangle'),
    question('Segitiga memiliki sisi 4 cm, 4 cm, dan 4 cm. Jenisnya ...', ['Sama sisi', 'Sama kaki', 'Sembarang', 'Siku-siku'], 0, 'Ketiga sisinya sama panjang, jadi termasuk segitiga sama sisi.', 'triangle-sides', ['4 cm', '4 cm', '4 cm']),
    question('Segitiga dengan semua sisi berbeda panjang disebut ...', ['Sama sisi', 'Sama kaki', 'Sembarang', 'Siku-siku'], 2, 'Segitiga sembarang memiliki panjang sisi yang berbeda-beda.', 'triangle'),
  ],
  [
    question('Segitiga memiliki sisi 6 cm, 7 cm, dan 8 cm. Berapa kelilingnya?', ['13 cm', '18 cm', '21 cm', '24 cm'], 2, 'Jumlahkan semua sisi: 6 + 7 + 8 = 21 cm.', 'triangle-sides', ['6 cm', '7 cm', '8 cm']),
    question('Keliling segitiga dengan sisi 3 cm, 4 cm, dan 5 cm adalah ...', ['7 cm', '9 cm', '12 cm', '15 cm'], 2, 'Keliling segitiga = 3 + 4 + 5 = 12 cm.', 'triangle-sides', ['3 cm', '4 cm', '5 cm']),
    question('Dua sisi segitiga 5 cm dan 7 cm. Sisi ketiga 6 cm. Kelilingnya ...', ['12 cm', '18 cm', '20 cm', '42 cm'], 1, 'Keliling = 5 + 7 + 6 = 18 cm.', 'triangle-sides', ['5 cm', '7 cm', '6 cm']),
    question('Keliling segitiga sama sisi dengan panjang sisi 9 cm adalah ...', ['18 cm', '27 cm', '36 cm', '81 cm'], 1, 'Keliling = 3 × 9 cm = 27 cm.', 'triangle'),
    question('Keliling segitiga 24 cm. Dua sisinya 8 cm dan 9 cm. Sisi ketiga ...', ['5 cm', '7 cm', '9 cm', '15 cm'], 1, 'Sisi ketiga = 24 − 8 − 9 = 7 cm.', 'triangle'),
  ],
  [
    question('Jumlah besar ketiga sudut dalam segitiga adalah ...', ['90°', '180°', '270°', '360°'], 1, 'Jika ketiga sudut segitiga dijumlahkan, hasilnya 180°.', 'triangle'),
    question('Dua sudut segitiga adalah 60° dan 60°. Sudut ketiga adalah ...', ['30°', '60°', '90°', '120°'], 1, 'Sudut ketiga = 180° − 60° − 60° = 60°.', 'triangle'),
    question('Segitiga siku-siku memiliki satu sudut sebesar ...', ['45°', '60°', '90°', '180°'], 2, 'Sudut siku-siku besarnya 90°.', 'triangle'),
    question('Dua sudut segitiga adalah 90° dan 35°. Sudut ketiganya ...', ['45°', '55°', '65°', '75°'], 1, 'Sudut ketiga = 180° − 90° − 35° = 55°.', 'triangle'),
    question('Segitiga sama sisi memiliki besar setiap sudut ...', ['45°', '60°', '90°', '120°'], 1, '180° dibagi tiga sudut yang sama besar adalah 60°.', 'triangle'),
  ],
  [
    question('Jari-jari lingkaran 7 cm. Berapa diameternya?', ['7 cm', '14 cm', '21 cm', '49 cm'], 1, 'Diameter adalah dua kali jari-jari: 2 × 7 cm = 14 cm.', 'circle-radius'),
    question('Jika jari-jari lingkaran 5 cm, diameternya ...', ['5 cm', '10 cm', '15 cm', '25 cm'], 1, 'Diameter = 2 × jari-jari = 2 × 5 = 10 cm.', 'circle-radius'),
    question('Diameter lingkaran 18 cm. Berapa jari-jarinya?', ['6 cm', '9 cm', '18 cm', '36 cm'], 1, 'Jari-jari adalah setengah diameter: 18 ÷ 2 = 9 cm.', 'circle-diameter'),
    question('Garis dari titik pusat ke tepi lingkaran disebut ...', ['Diameter', 'Jari-jari', 'Keliling', 'Busur'], 1, 'Jari-jari menghubungkan titik pusat dengan tepi lingkaran.', 'circle-radius'),
    question('Jika diameter lingkaran 12 cm, jari-jarinya ...', ['4 cm', '6 cm', '12 cm', '24 cm'], 1, 'Jari-jari = diameter ÷ 2 = 12 ÷ 2 = 6 cm.', 'circle-diameter'),
  ],
  [
    question('Diameter sebuah lingkaran 20 cm. Berapa jari-jarinya?', ['5 cm', '10 cm', '20 cm', '40 cm'], 1, 'Jari-jari adalah setengah dari diameter.', 'circle-diameter'),
    question('Jari-jari lingkaran 4 cm. Berapa diameternya?', ['2 cm', '4 cm', '8 cm', '16 cm'], 2, 'Diameter = 2 × 4 cm = 8 cm.', 'circle-radius'),
    question('Garis yang melewati titik pusat dan menghubungkan dua tepi lingkaran adalah ...', ['Jari-jari', 'Diameter', 'Busur', 'Tali busur pendek'], 1, 'Diameter melewati titik pusat dan panjangnya dua kali jari-jari.', 'circle-diameter'),
    question('Jari-jari lingkaran 11 cm. Diameternya ...', ['11 cm', '22 cm', '33 cm', '121 cm'], 1, 'Diameter = 2 × 11 cm = 22 cm.', 'circle-radius'),
    question('Diameter lingkaran 30 cm. Berapa jari-jarinya?', ['10 cm', '15 cm', '20 cm', '60 cm'], 1, 'Jari-jari = 30 ÷ 2 = 15 cm.', 'circle-diameter'),
  ],
  [
    question('Berapa luas lingkaran dengan jari-jari 7 cm? (π = 22/7)', ['44 cm²', '77 cm²', '154 cm²', '308 cm²'], 2, 'Luas = π × r × r = 22/7 × 7 × 7 = 154 cm².', 'circle-radius'),
    question('Luas lingkaran berjari-jari 1 cm adalah ... (π = 3,14)', ['3,14 cm²', '6,28 cm²', '9,42 cm²', '12,56 cm²'], 0, 'Luas = π × 1 × 1 = 3,14 cm².', 'circle-radius'),
    question('Berapa luas lingkaran berjari-jari 14 cm? (π = 22/7)', ['308 cm²', '616 cm²', '1.232 cm²', '1.540 cm²'], 1, 'Luas = 22/7 × 14 × 14 = 616 cm².', 'circle-radius'),
    question('Rumus untuk menghitung luas lingkaran adalah ...', ['π × r', '2 × π × r', 'π × r × r', 'π + r'], 2, 'Luas lingkaran = π × jari-jari × jari-jari.', 'circle-radius'),
    question('Lingkaran berjari-jari 10 cm. Berapa luasnya? (π = 3,14)', ['31,4 cm²', '62,8 cm²', '314 cm²', '628 cm²'], 2, 'Luas = 3,14 × 10 × 10 = 314 cm².', 'circle-radius'),
  ],
  [
    question('Bangun gabungan ini terdiri dari bangun apa saja?', [
      { label: 'Persegi dan lingkaran', icon: '□ ○' }, { label: 'Persegi panjang dan segitiga', icon: '▭ △' },
      { label: 'Dua lingkaran', icon: '○ ○' }, { label: 'Dua segitiga', icon: '△ △' },
    ], 1, 'Bentuk atapnya segitiga dan bagian bawahnya persegi panjang.', 'composite-triangle'),
    question('Bentuk badan rumah adalah persegi panjang dan atapnya segitiga. Ada berapa bangun penyusun?', ['1 bangun', '2 bangun', '3 bangun', '4 bangun'], 1, 'Bangun tersebut tersusun dari satu persegi panjang dan satu segitiga.', 'composite-triangle'),
    question('Sebuah gambar terdiri dari 2 persegi dan 1 lingkaran. Jumlah bangun datarnya ...', ['2', '3', '4', '5'], 1, 'Jumlahkan bangunnya: 2 persegi + 1 lingkaran = 3 bangun.', 'composite-triangle'),
    question('Bangun gabungan terdiri dari persegi sisi 3 cm dan persegi sisi 2 cm. Jumlah luasnya ...', ['5 cm²', '9 cm²', '13 cm²', '18 cm²'], 2, 'Luas total = (3 × 3) + (2 × 2) = 9 + 4 = 13 cm².', 'composite-triangle'),
    question('Atap segitiga memiliki alas 8 cm dan tinggi 3 cm. Luasnya ...', ['11 cm²', '12 cm²', '24 cm²', '48 cm²'], 1, 'Luas segitiga = ½ × alas × tinggi = ½ × 8 × 3 = 12 cm².', 'triangle'),
  ],
  [
    question('Persegi panjang berukuran 8 cm × 4 cm. Berapa luasnya?', ['12 cm²', '24 cm²', '32 cm²', '40 cm²'], 2, 'Luas persegi panjang = panjang × lebar = 8 × 4 = 32 cm².', 'rectangle'),
    question('Luas persegi sisi 6 cm ditambah luas persegi sisi 2 cm adalah ...', ['20 cm²', '36 cm²', '40 cm²', '64 cm²'], 2, 'Jumlah luas = (6 × 6) + (2 × 2) = 36 + 4 = 40 cm².', 'square'),
    question('Persegi panjang 5 cm × 4 cm ditempel dengan persegi 3 cm × 3 cm. Jumlah luasnya ...', ['29 cm²', '32 cm²', '35 cm²', '47 cm²'], 0, 'Jumlah luas = (5 × 4) + (3 × 3) = 20 + 9 = 29 cm².', 'rectangle'),
    question('Sebuah bangun gabungan memiliki persegi panjang 7 × 2 cm dan persegi 2 × 2 cm. Luas totalnya ...', ['14 cm²', '16 cm²', '18 cm²', '28 cm²'], 2, 'Luas total = (7 × 2) + (2 × 2) = 14 + 4 = 18 cm².', 'rectangle'),
    question('Luas persegi panjang 24 cm². Panjangnya 6 cm. Lebarnya ...', ['3 cm', '4 cm', '6 cm', '18 cm'], 1, 'Lebar = luas ÷ panjang = 24 ÷ 6 = 4 cm.', 'rectangle'),
  ],
  [
    question('Sebuah taman persegi panjang panjangnya 9 m dan lebarnya 4 m. Berapa kelilingnya?', ['13 m', '26 m', '36 m', '40 m'], 1, 'Keliling persegi panjang = 2 × (9 + 4) = 26 m.', 'rectangle'),
    question('Bangun gabungan terdiri dari persegi sisi 4 cm dan segitiga bersisi 3, 4, dan 5 cm. Jumlah keliling keduanya ...', ['16 cm', '24 cm', '28 cm', '32 cm'], 2, 'Keliling persegi 16 cm dan segitiga 12 cm, jumlahnya 28 cm.', 'triangle'),
    question('Keliling persegi 16 cm. Berapa panjang sisinya?', ['2 cm', '4 cm', '8 cm', '12 cm'], 1, 'Panjang sisi = 16 ÷ 4 = 4 cm.', 'square'),
    question('Sebuah bentuk gabungan dibuat dari dua persegi panjang berkeliling 18 cm dan 14 cm. Jumlah kedua kelilingnya ...', ['22 cm', '28 cm', '32 cm', '36 cm'], 2, 'Jumlahkan kedua keliling: 18 + 14 = 32 cm.'),
    question('Bangun gabungan memiliki sisi luar 5 cm, 4 cm, 3 cm, dan 6 cm. Keliling sisi luarnya ...', ['12 cm', '15 cm', '18 cm', '20 cm'], 2, 'Keliling adalah jumlah sisi luar: 5 + 4 + 3 + 6 = 18 cm.'),
  ],
];

const LEVEL_COLORS = [
  ['#ffc33d', '#df7a19'], ['#71d6a5', '#228c68'], ['#58b9f4', '#176ba5'],
  ['#ac95f4', '#6550bd'], ['#52d4d7', '#168f98'], ['#83cf66', '#438f3e'],
  ['#ff9b67', '#ce5d36'], ['#68c8ed', '#287aa6'], ['#f39fc4', '#b94f80'],
  ['#89a8f4', '#526dbe'], ['#e8a4fa', '#9c55b3'], ['#77d6bd', '#2d987e'],
  ['#ffbd68', '#c57a29'], ['#72c6e8', '#277c9f'], ['#a7c96c', '#628c37'],
];

function inferPictureType(prompt) {
  const text = prompt.toLowerCase();
  if (text.includes('gabungan') || text.includes('gambar terdiri') || text.includes('bangun penyusun')) {
    return 'composite-triangle';
  }
  if (text.includes('segitiga') || text.includes('atap')) return 'triangle';
  if (text.includes('lingkaran') || text.includes('jari-jari') || text.includes('diameter')) return 'circle-radius';
  if (text.includes('persegi panjang') || text.includes('segi empat')) return 'rectangle';
  if (text.includes('persegi')) return 'square';
  return 'objects';
}

function objectIcon(choice) {
  if (choice.icon) return choice.icon;
  const label = choice.label.toLowerCase();
  if (label.includes('segitiga')) return '🔺';
  if (label.includes('persegi panjang')) return '▰';
  if (label.includes('persegi')) return '🟦';
  if (label.includes('lingkaran')) return '🔵';
  if (label.includes('bola')) return '⚽';
  if (label.includes('buku')) return '📘';
  if (label.includes('dadu')) return '🎲';
  if (label.includes('penggaris')) return '📏';
  return ['🔺', '🟦', '🔵', '▰'][choice.label.length % 4];
}

function QuestionPicture({ question, levelId, questionIndex }) {
  const { prompt, choices, pictureLabels } = question;
  const type = question.picture || inferPictureType(prompt);
  const [fill, stroke] = LEVEL_COLORS[(levelId - 1) % LEVEL_COLORS.length];
  const variant = questionIndex % 5;
  const measurements = prompt.match(/\d+(?:[,.]\d+)?\s*(?:cm²|cm|m²|m|°)?/g) ?? [];
  const label = measurements[0] || `Soal ${questionIndex + 1}`;
  const accessibilityLabel = `Ilustrasi Level ${levelId}, soal ${questionIndex + 1}: ${prompt}`;
  const pictureProps = {
    className: 'quiz-picture quiz-picture-shape',
    role: 'img',
    'aria-label': accessibilityLabel,
    style: {
      '--quiz-picture-fill': fill,
      '--quiz-picture-stroke': stroke,
      background: `linear-gradient(140deg, ${fill}33, #f3fcff)`,
    },
  };

  if (type === 'objects') {
    return (
      <div
        className="quiz-picture quiz-picture-objects"
        role="img"
        aria-label={accessibilityLabel}
        style={pictureProps.style}
      >
        {choices.map((choice) => (
          <span key={choice.label} aria-hidden="true">{objectIcon(choice)}</span>
        ))}
      </div>
    );
  }

  if (type === 'composite-triangle') {
    const promptText = prompt.toLowerCase();
    const isTwoSquares = promptText.includes('2 persegi')
      || promptText.includes('dua persegi')
      || promptText.includes('persegi sisi');
    return (
      <div {...pictureProps}>
        <svg viewBox="0 0 240 160" aria-hidden="true">
          {isTwoSquares ? (
            <>
              <rect x="34" y="46" width="72" height="72" rx="5" fill={fill} stroke={stroke} strokeWidth="5" />
              <rect x="132" y="65" width="52" height="52" rx="5" fill="#58c6ed" stroke="#2478ac" strokeWidth="5" />
              <text x="70" y="137" fill="#174b79" fontSize="11" fontWeight="800" textAnchor="middle">3 cm</text>
              <text x="158" y="137" fill="#174b79" fontSize="11" fontWeight="800" textAnchor="middle">2 cm</text>
              {promptText.includes('lingkaran') && <circle cx="204" cy="50" r="20" fill="#ff8ab4" stroke="#c63f78" strokeWidth="4" />}
            </>
          ) : promptText.includes('badan rumah') ? (
            <>
              <rect x="54" y="66" width="132" height="74" rx="4" fill="#58c6ed" stroke="#2478ac" strokeWidth="5" />
              <polygon points="42,68 120,17 198,68" fill={fill} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
              <rect x="105" y="98" width="30" height="42" fill="#9b542b" stroke="#71391f" strokeWidth="4" />
              <path d="M120 17v50" stroke={stroke} strokeWidth="3" />
            </>
          ) : (
            <>
              <rect x="52" y="64" width="136" height="78" rx="5" fill="#58c6ed" stroke="#2478ac" strokeWidth="5" />
              <polygon points="40,68 120,15 200,68" fill={fill} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
              <path d={variant % 2 === 0 ? 'M120 15v53' : 'M120 15v127'} stroke={stroke} strokeWidth="4" />
              {variant % 2 === 1 && <circle cx="167" cy="109" r="13" fill="#ff8ab4" stroke="#c63f78" strokeWidth="3" />}
            </>
          )}
          <text x="120" y="154" fill="#174b79" fontSize="12" fontWeight="800" textAnchor="middle">
            {isTwoSquares ? 'GABUNGAN PERSEGI' : 'SEGITIGA + PERSEGI PANJANG'}
          </text>
        </svg>
      </div>
    );
  }

  if (type === 'house') {
    return (
      <div {...pictureProps} className="quiz-picture quiz-picture-house">
        <svg viewBox="0 0 300 190" aria-hidden="true">
          <rect width="300" height="190" rx="18" fill="#bceeff" />
          <path d="M0 148c46-14 91 2 142-5 54-8 103-2 158 8v39H0z" fill="#78cf62" />
          <path d="M73 87 150 24l78 63v74H73z" fill="#fff3d4" stroke="#8b583a" strokeWidth="6" strokeLinejoin="round" />
          <path d="m60 91 90-74 91 74-11 13-80-64-79 64z" fill={fill} stroke={stroke} strokeWidth="6" strokeLinejoin="round" />
          <rect x="91" y="106" width="43" height="55" rx="3" fill="#9b542b" stroke="#71391f" strokeWidth="5" />
          <circle cx="124" cy="135" r="3" fill="#ffd46a" />
          <rect x="157" y="101" width="47" height="43" rx="3" fill="#58d2f3" stroke="#8b583a" strokeWidth="7" />
          <path d="M180 101v43m-23-21h47" stroke="#8b583a" strokeWidth="5" />
          <rect x="215" y="47" width="20" height="43" fill="#bc5840" stroke="#8b583a" strokeWidth="5" />
        </svg>
      </div>
    );
  }

  if (type === 'triangle' || type === 'triangle-sides') {
    const trianglePoints = [
      '100,16 180,132 20,132',
      '100,16 164,132 36,132',
      '44,132 174,132 174,32',
      '100,18 184,132 34,110',
      '100,16 180,132 20,132',
    ][variant];
    return (
      <div {...pictureProps}>
        <svg viewBox="0 0 200 160" aria-hidden="true">
          <polygon points={trianglePoints} fill={fill} stroke={stroke} strokeWidth="7" strokeLinejoin="round" />
          {variant === 2 && <path d="M154 132v-20h20" fill="none" stroke="#174b79" strokeWidth="4" />}
          {variant === 4 && <circle cx="100" cy="92" r="8" fill="#fff" stroke={stroke} strokeWidth="3" />}
          {type === 'triangle-sides' && pictureLabels?.length === 3 ? (
            <g fill="#174b79" fontSize="12" fontWeight="800" textAnchor="middle">
              <text x="100" y="151">{pictureLabels[2]}</text>
              <text x="48" y="75" transform="rotate(-56 48 75)">{pictureLabels[0]}</text>
              <text x="151" y="75" transform="rotate(56 151 75)">{pictureLabels[1]}</text>
            </g>
          ) : (
            <text x="100" y="151" fill="#174b79" fontSize="12" fontWeight="800" textAnchor="middle">
              {prompt.toLowerCase().includes('sudut') ? '∠  ' : ''}{label}
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (type === 'square' || type === 'rectangle') {
    const isSquare = type === 'square';
    const x = isSquare ? 54 : 31;
    const y = isSquare ? 15 : 39;
    const width = isSquare ? 132 : 178;
    const height = isSquare ? 132 : 88;
    const markings = [
      <path key="diagonal" d={`M${x} ${y}l${width} ${height}M${x + width} ${y}l-${width} ${height}`} />,
      <path key="grid" d={`M${x + width / 2} ${y}v${height}M${x} ${y + height / 2}h${width}`} />,
      <path key="ticks" d={`M${x + width / 2} ${y - 8}v16M${x + width / 2} ${y + height - 8}v16M${x - 8} ${y + height / 2}h16M${x + width - 8} ${y + height / 2}h16`} />,
      <path key="perimeter" d={`M${x + 14} ${y + 14}h${width - 28}v${height - 28}h-${width - 28}z`} strokeDasharray="5 5" />,
      <path key="cross" d={`M${x + width / 2} ${y}v${height}M${x} ${y + height / 2}h${width}M${x} ${y}l${width} ${height}`} />,
    ];
    return (
      <div {...pictureProps}>
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <rect x={x} y={y} width={width} height={height} rx="8" fill={fill} stroke={stroke} strokeWidth="7" />
          <g fill="none" stroke={stroke} strokeWidth={variant === 2 ? 3 : 5}>
            {markings[variant]}
          </g>
          {measurements.slice(0, 2).map((measure, index) => (
            <text
              key={measure + index}
              x={isSquare ? 120 : index === 0 ? 120 : 17}
              y={isSquare ? (index === 0 ? 12 : 172) : (index === 0 ? 34 : 92)}
              fill="#174b79"
              fontSize="12"
              fontWeight="800"
              textAnchor="middle"
            >
              {measure}
            </text>
          ))}
          {!measurements.length && (
            <text x="120" y="172" fill="#174b79" fontSize="12" fontWeight="800" textAnchor="middle">
              {isSquare ? '4 SISI SAMA' : 'PANJANG × LEBAR'}
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (type === 'circle-radius' || type === 'circle-diameter') {
    const isRadius = type === 'circle-radius';
    const line = isRadius ? 'M120 80h58' : 'M62 80h116';
    return (
      <div {...pictureProps}>
        <svg viewBox="0 0 240 160" aria-hidden="true">
          <circle cx="120" cy="80" r={48 + (variant % 3) * 5} fill={fill} stroke={stroke} strokeWidth="6" />
          <circle cx="120" cy="80" r="5" fill="#174b79" />
          <path d={line} stroke="#174b79" strokeWidth="4" strokeDasharray={variant === 3 ? '6 4' : undefined} />
          {variant === 1 && <path d="M120 80v58" stroke="#fff" strokeWidth="3" />}
          {variant === 4 && <circle cx="120" cy="80" r="15" fill="none" stroke="#fff" strokeWidth="3" />}
          <text x="148" y="70" fill="#174b79" fontSize="14" fontWeight="800">
            {isRadius ? 'r' : 'd'} {label}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div {...pictureProps}>
      <svg viewBox="0 0 300 190" aria-hidden="true">
        <rect width="300" height="190" rx="18" fill="#bceeff" />
        <path d="M0 148c46-14 91 2 142-5 54-8 103-2 158 8v39H0z" fill="#78cf62" />
        <path d="M73 87 150 24l78 63v74H73z" fill="#fff3d4" stroke="#8b583a" strokeWidth="6" strokeLinejoin="round" />
        <path d="m60 91 90-74 91 74-11 13-80-64-79 64z" fill="#f14c3e" stroke="#9e382e" strokeWidth="6" strokeLinejoin="round" />
        <rect x="91" y="106" width="43" height="55" rx="3" fill="#9b542b" stroke="#71391f" strokeWidth="5" />
        <circle cx="124" cy="135" r="3" fill="#ffd46a" />
        <rect x="157" y="101" width="47" height="43" rx="3" fill="#58d2f3" stroke="#8b583a" strokeWidth="7" />
        <path d="M180 101v43m-23-21h47" stroke="#8b583a" strokeWidth="5" />
        <rect x="215" y="47" width="20" height="43" fill="#bc5840" stroke="#8b583a" strokeWidth="5" />
      </svg>
    </div>
  );
}

function ChoiceIcon({ choice }) {
  if (choice.shape === 'triangle') {
    return <span className="quiz-choice-shape triangle" aria-hidden="true" />;
  }
  if (choice.shape === 'square') {
    return <span className="quiz-choice-shape square" aria-hidden="true" />;
  }
  if (choice.shape === 'rectangle') {
    return <span className="quiz-choice-shape rectangle" aria-hidden="true" />;
  }
  if (choice.shape === 'circle') {
    return <span className="quiz-choice-shape circle" aria-hidden="true" />;
  }
  return <span className="quiz-choice-emoji" aria-hidden="true">{choice.icon || '•'}</span>;
}

function starsForScore(score) {
  if (score >= 750) return 3;
  if (score >= 650) return 2;
  if (score >= 500) return 1;
  return 0;
}

function QuizScoreView({
  levelId,
  score,
  coinsTotal,
  correctAnswers,
  xpEarned,
  onFinish,
  onRetry,
}) {
  return (
    <section className="quiz-score-screen" aria-label={`Skor Level ${levelId}`}>
      <div className="quiz-score-card">
        <div className="quiz-score-panel">
          <div className="quiz-score-metrics">
            <div className="quiz-score-metric">
              <span className="quiz-score-icon" aria-hidden="true">⭐</span>
              <strong>Skor</strong>
              <b>{score}</b>
            </div>
            <div className="quiz-score-metric">
              <span className="quiz-score-icon" aria-hidden="true">🪙</span>
              <strong>Koin</strong>
              <b>{coinsTotal}</b>
            </div>
            <div className="quiz-score-metric">
              <span className="quiz-score-icon xp" aria-hidden="true">XP</span>
              <strong>XP</strong>
              <b>+{xpEarned}</b>
            </div>
          </div>
          <div className="quiz-score-answers">
            <strong>✋ Jawaban</strong>
            <span><i aria-hidden="true">✓</i>{correctAnswers} benar / {correctAnswers + (5 - correctAnswers)} soal</span>
          </div>
        </div>

        <div className="quiz-score-actions">
          <button
            className="quiz-score-continue"
            onClick={() => {
              playClick();
              onFinish?.({ score, stars: starsForScore(score) });
            }}
          >
            Lanjutkan
          </button>
          <button
            className="quiz-score-retry"
            onClick={() => {
              playClick();
              onRetry?.();
            }}
          >
            ↻ Ulangi
          </button>
        </div>
      </div>
    </section>
  );
}

export default function QuizView({
  levelId,
  explorationPoints = 0,
  coinsTotal = 0,
  xpEarned = 100,
  onFinish,
  onRetry,
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const levelQuestions = QUESTIONS[levelId - 1] ?? QUESTIONS[0];
  const question = levelQuestions[questionIndex];
  const isCorrect = question.correct.length === selectedChoices.length
    && question.correct.every((choice) => selectedChoices.includes(choice));
  const progressValue = questionIndex + (answered ? 1 : 0);

  const handleChoice = (index) => {
    if (answered) return;
    playClick();
    if (question.multiple) {
      setSelectedChoices((previous) => (
        previous.includes(index)
          ? previous.filter((choice) => choice !== index)
          : [...previous, index]
      ));
      return;
    }
    setSelectedChoices([index]);
  };

  const handleSubmit = () => {
    if (!selectedChoices.length || answered) return;
    setAnswered(true);
    if (isCorrect) {
      const bonus = hintUsed ? 0 : 50;
      setScore((previous) => previous + 100 + bonus);
      setCorrectAnswers((previous) => previous + 1);
      playSuccess();
      launchConfetti();
    } else {
      playBounce();
    }
  };

  if (showScore) {
    const finalScore = score + explorationPoints;
    return (
      <QuizScoreView
        levelId={levelId}
        score={finalScore}
        coinsTotal={coinsTotal}
        correctAnswers={correctAnswers}
        xpEarned={xpEarned}
        onFinish={onFinish}
        onRetry={onRetry}
      />
    );
  }

  return (
    <section className="quiz-stage" aria-label={`Soal Level ${levelId}`}>
      <header className="quiz-stage-header">
        <div className="quiz-stage-heading">
          <strong>Soal Level {levelId} · {score + explorationPoints} poin</strong>
          <span>{questionIndex + 1}/{levelQuestions.length}</span>
        </div>
        <div
          className="quiz-stage-progress"
          role="progressbar"
          aria-label="Progres soal"
          aria-valuemin={0}
          aria-valuemax={levelQuestions.length}
          aria-valuenow={progressValue}
        >
          <span style={{ width: `${(progressValue / levelQuestions.length) * 100}%` }} />
        </div>
      </header>

      <div className="quiz-question-card" aria-live="polite">
        <>
          <div className="quiz-question-heading">
            <span>Soal {questionIndex + 1} dari {levelQuestions.length}</span>
            {question.multiple && <small>Pilih semua jawaban yang benar</small>}
          </div>
          <h1 className="quiz-question-prompt">{question.prompt}</h1>
          <QuestionPicture question={question} levelId={levelId} questionIndex={questionIndex} />
          <div className={`quiz-choice-list${question.multiple ? ' multiple' : ''}`}>
              {question.choices.map((choice, index) => {
                const isSelected = selectedChoices.includes(index);
                const isAnswer = question.correct.includes(index);
                let stateClass = '';
                if (answered && isAnswer) stateClass = ' correct';
                else if (answered && isSelected) stateClass = ' wrong';
                else if (isSelected) stateClass = ' selected';

                return (
                  <button
                    key={choice.label}
                    className={`quiz-choice${stateClass}`}
                    onClick={() => handleChoice(index)}
                    disabled={answered}
                    aria-pressed={isSelected}
                  >
                    <ChoiceIcon choice={choice} />
                    <span>{choice.label}</span>
                    <span className="quiz-choice-mark" aria-hidden="true">
                      {answered && isAnswer ? '✓' : answered && isSelected ? '×' : isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
          </div>

          {!answered && (
            <div className="quiz-hint-area">
              <button
                type="button"
                className="quiz-hint-button"
                disabled={hintUsed}
                onClick={() => {
                  playClick();
                  setHintUsed(true);
                  setHintVisible(true);
                }}
              >
                {hintVisible ? 'Petunjuk digunakan · bonus soal ini tidak berlaku' : '💡 Lihat petunjuk'}
              </button>
              {hintVisible && <p className="quiz-answer-feedback">{question.hint}</p>}
            </div>
          )}

          {answered ? (
            <>
              <p className={`quiz-answer-feedback${isCorrect ? ' success' : ' retry'}`} role="status">
                {isCorrect
                  ? `Benar! +100 poin${hintUsed ? '.' : ' dan +50 bonus tanpa petunjuk.'}`
                  : `Jawaban salah, 0 poin. Jawaban yang benar: ${question.correct.map((index) => question.choices[index].label).join(', ')}. ${question.hint}`}
              </p>
              {questionIndex === levelQuestions.length - 1 ? (
                <button
                  className="quiz-submit-button"
                  onClick={() => {
                    playClick();
                    setShowScore(true);
                  }}
                >
                  Lihat Skor
                </button>
              ) : (
                <button
                  className="quiz-submit-button"
                  onClick={() => {
                    playClick();
                    setQuestionIndex((previous) => previous + 1);
                    setHintUsed(false);
                    setHintVisible(false);
                    setSelectedChoices([]);
                    setAnswered(false);
                  }}
                >
                  Soal berikutnya
                </button>
              )}
            </>
          ) : (
            <button
              className="quiz-submit-button"
              onClick={handleSubmit}
              disabled={!selectedChoices.length}
            >
              Cek jawaban
            </button>
          )}
        </>
      </div>
    </section>
  );
}
