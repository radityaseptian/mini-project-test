# TECHNICAL TEST — FULL STACK DEVELOPER

## Topik : Mini Project Sistem Manajemen Berita

Penjelasan Arsitektur singkat `CLIENT => BACKEND API => DATABASE => PUBLISH EVENT QUEUE => WORKER CONSUMER & INDEX DATA KE ELASTIC SEARCH`

1. Client Request http POST /api/news

2. Backend API menerima dan validasi data input, simpan ke database, dan publish event queue

3. Worker Consumer menerima data dan melakukan index data ke elastic search

### Instalasi Dan Setup

1. Clone projek `git clone https://github.com/radityaseptian/mini-project-test.git && cd mini-project-test`

2. Konfigurasi environment: buat file `.env` lalu copy semua value dalam contoh `.env.example` ke `.env` yang sudah dibuat dan disesuaikan dengan konfigurasi atau tidak diedit sama sekali

3. Jalankan projek dengan perintah `docker compose up --build` yang secara otomatis akan menjalankan semua services dan membuat dummy data _News_

### Uji APi

Pengujian API bisa dilakukan menggunakan _Postman_

Base URL : `http://localhost:3000`

#### Membuat Berita Baru

```http
  POST /api/news
```

| Request Body | Type   | Description                     |
| :----------- | :----- | :------------------------------ |
| title        | string | _Required_. Judul Berita        |
| content      | string | _Required_. Isi Konten Berita   |
| author       | string | _Required_. Nama Pembuat Berita |
| source       | string | _Required_. Sumber Berita       |

#### Mengambil Berita Pagination

```http
  GET /api/news
```

| Request Query | Type   | Description               |
| :------------ | :----- | :------------------------ |
| page          | number | _Optional_. Default 1     |
| limit         | number | _Optional_. Default 10    |
| source        | string | _Optional_. Sumber Berita |

#### Pencarian Berita

```http
  GET /api/search
```

| Request Query | Type   | Description                                 |
| :------------ | :----- | :------------------------------------------ |
| q             | string | _Required_. Query Pencarian Minimal 2 huruf |
| author        | string | _Optional_. Nama Pembuat Berita             |
| source        | string | _Optional_. Sumber Berita                   |
