# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Aturan Permainan

- Setiap level memiliki 5 soal yang berbeda.
- Jawaban benar memberi 100 poin; menjawab benar tanpa petunjuk memberi bonus 50 poin.
- Jawaban salah tidak memberi poin dan dapat dicoba lagi setelah membaca penjelasan.
- Setiap collectible yang ditemukan saat eksplorasi memberi 10 poin.
- Bintang diberikan berdasarkan skor akhir: 1 bintang mulai 500 poin, 2 mulai 650 poin, dan 3 mulai 750 poin.
- Level yang selesai memberi 100 XP. Koin yang dikumpulkan dapat digunakan untuk aksesori.
- Jika kehilangan seluruh nyawa, pemain kembali ke checkpoint dan nyawanya dipulihkan.
- Setelah soal kelima, layar skor memakai ilustrasi level selesai dan bidang putih untuk bintang, poin, jawaban benar/salah, bonus, XP, serta koin. Tombol Ulangi memulai ulang level; Lanjut menyimpan hasil dan kembali ke peta.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
