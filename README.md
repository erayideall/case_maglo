# Maglo Dashboard

Modern ve responsive bir dashboard uygulaması. Next.js App Router, React ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

- ⚡ Next.js 15 App Router
- ⚛️ React 19
- 🎨 Tailwind CSS 4
- 📱 Responsive tasarım
- 🔐 Dashboard sayfaları
- 📊 İstatistik kartları
- 👥 Kullanıcı yönetimi
- 📈 Analytics sayfası
- ⚙️ Ayarlar sayfası

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
maglo/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard sayfaları
│   │   ├── analytics/    # Analytics sayfası
│   │   ├── settings/     # Ayarlar sayfası
│   │   ├── users/        # Kullanıcılar sayfası
│   │   ├── layout.tsx    # Dashboard layout
│   │   └── page.tsx      # Dashboard ana sayfa
│   ├── globals.css       # Global stiller
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Ana sayfa
├── components/            # React komponentleri
│   └── dashboard/        # Dashboard komponentleri
│       ├── Chart.tsx
│       ├── Header.tsx
│       ├── RecentActivity.tsx
│       ├── Sidebar.tsx
│       └── StatsCard.tsx
├── public/               # Statik dosyalar
└── lib/                  # Yardımcı fonksiyonlar
```

## Sayfalar

- **Ana Sayfa** (`/`) - Karşılama sayfası
- **Dashboard** (`/dashboard`) - Ana dashboard sayfası
- **Kullanıcılar** (`/dashboard/users`) - Kullanıcı listesi ve yönetimi
- **Analytics** (`/dashboard/analytics`) - Detaylı analiz ve raporlar
- **Ayarlar** (`/dashboard/settings`) - Uygulama ayarları

## Komutlar

```bash
npm run dev      # Geliştirme sunucusunu başlat
npm run build    # Production build oluştur
npm run start    # Production sunucusunu başlat
npm run lint     # Linting kontrolü
```

## Teknolojiler

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
