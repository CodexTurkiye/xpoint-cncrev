# Xpoint Ahşap CNC Yönetim Sistemi

Xpoint firması için geliştirilmiş ahşap CNC fason kesim yönetim sistemi.

## Özellikler

- **Müşteri Yönetimi**: Müşteri bilgilerini ekleme, düzenleme ve takip etme
- **Ürün Yönetimi**: Ahşap malzemeler ve kesici takımların stok takibi
- **Sipariş Yönetimi**: Sipariş alma, takip etme ve durum güncelleme
- **Stok Girişi**: Yeni ürün girişi ve maliyet takibi
- **Maliyet Takibi**: Gelir-gider analizi ve karlılık hesaplama

## Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd xpoint-app
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Vercel'de Deploy Etme

1. [Vercel](https://vercel.com) hesabınızla giriş yapın
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi bağlayın
4. Vercel otomatik olarak Next.js projesini algılayacak
5. "Deploy" butonuna tıklayın

## Sayfalar

- **Ana Sayfa**: Genel istatistikler ve hızlı erişim
- **Müşteriler**: Müşteri bilgileri yönetimi
- **Ürünler**: Stok takibi ve ürün yönetimi
- **Siparişler**: Sipariş takibi ve durum yönetimi
- **Stok Girişi**: Yeni ürün girişi ve maliyet takibi
- **Maliyetler**: Gelir-gider analizi

## Özellikler

### Müşteri Yönetimi
- Müşteri ekleme/düzenleme/silme
- İletişim bilgileri takibi
- Sipariş geçmişi görüntüleme

### Ürün Yönetimi
- Ürün kategorileri (Ahşap, Kesici Takım, Aksesuar)
- Stok seviyesi takibi
- Minimum stok uyarıları
- Tedarikçi bilgileri

### Sipariş Yönetimi
- Sipariş durumu takibi (Beklemede, İşlemde, Tamamlandı, Teslim Edildi)
- Ödeme durumu takibi
- Teslim tarihi yönetimi
- Detaylı sipariş bilgileri

### Stok Girişi
- Yeni ürün girişi
- Nakliye ücreti takibi
- Tedarikçi bilgileri
- Maliyet hesaplama

### Maliyet Takibi
- Gelir-gider kayıtları
- Kategori bazında analiz
- Net kar/zarar hesaplama
- Detaylı maliyet raporları

## Lisans

Bu proje Xpoint firması için özel olarak geliştirilmiştir.