# OpenMusic API

OpenMusic adalah aplikasi pemutar musik terbuka yang menyediakan musik berlisensi gratis untuk semua orang. Proyek ini bertujuan untuk memberikan platform bagi pengguna untuk menikmati musik tanpa batasan.

## Deskripsi

Sebagai seorang Back-End Developer, Anda akan bergabung dengan tim TSC (Technical Steering Committee) dalam mengembangkan aplikasi ini. Aplikasi ini dibangun menggunakan Node.js dan Hapi.js sebagai framework server.

## Fitur

- Menyediakan API untuk mengelola album dan lagu.
- Validasi input menggunakan Joi.
- Migrasi database menggunakan node-pg-migrate.
- Konfigurasi lingkungan menggunakan dotenv.

## Prerequisites

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal [Node.js](https://nodejs.org/) dan [npm](https://www.npmjs.com/).

## Instalasi

1. Clone repositori ini:
   ```bash
   git clone <url-repositori>
   cd openmusic-api
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan migrasi database (jika diperlukan):
   ```bash
   npm run migrate
   ```

4. Jalankan server:
   ```bash
   npm start
   ```

## Skrip

- `start:prod`: Menjalankan server dalam mode produksi.
- `start`: Menjalankan server dengan nodemon untuk pengembangan.
- `lint`: Memeriksa kode menggunakan ESLint.
- `migrate`: Menjalankan migrasi database.

## Lisensi

Proyek ini dilisensikan di bawah lisensi ISC. Lihat file LICENSE untuk detail lebih lanjut.

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buat pull request atau buka isu untuk diskusi.

## Kontak

Untuk pertanyaan lebih lanjut, silakan hubungi [ibnubs](mailto:ibnubs@gmail.com).
