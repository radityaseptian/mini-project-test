import { prismaClient } from './prismaClient'
import { getRabbitChannel } from './rabbitmq'

const titles = [
  'Gempa Mengguncang Kota',
  'Teknologi Baru AI',
  'Pasar Saham Naik',
  'Olahraga Nasional',
  'Penemuan Sains',
  'Politik Terkini',
  'Festival Musik',
  'Tips Kesehatan',
  'Kuliner Nusantara',
  'Inovasi Startup',
  'Ekonomi Global',
  'Cuaca Ekstrem',
  'Perjalanan Wisata',
  'Film Terbaru',
  'Pertanian Modern',
  'Lingkungan Hidup',
  'Transportasi Masa Depan',
  'Kesejahteraan Sosial',
  'Teknologi Blockchain',
  'Peristiwa Bersejarah'
]

const authors = [
  'Budi Santoso',
  'Siti Aminah',
  'Ahmad Fauzi',
  'Dewi Lestari',
  'Rudi Hartono',
  'Maya Sari',
  'Teguh Prasetyo',
  'Intan Permata',
  'Yoga Nugroho',
  'Nina Kurnia'
]

const contents = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Berita terbaru mengenai perkembangan teknologi dan inovasi terkini di berbagai bidang.',
  'Analisis mendalam tentang situasi politik dan ekonomi saat ini.',
  'Tips dan trik untuk meningkatkan kualitas hidup serta kesehatan sehari-hari.',
  'Laporan dari lapangan mengenai peristiwa penting yang terjadi baru-baru ini.',
  'Ringkasan penelitian dan studi terbaru dalam bidang sains dan teknologi.',
  'Ulasan mengenai hiburan, film, musik, dan budaya populer.',
  'Informasi praktis seputar perjalanan, wisata, dan kuliner.'
]

const sources = ['twitter', 'facebook', 'website']

const random = (data: any[]) => data[Math.floor(Math.random() * data.length)]

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

const newsData = Array.from({ length: 100 }, (_, i) => ({
  title: random(titles) + ` #${i + 1}`,
  author: random(authors),
  content: random(contents),
  source: random(sources),
  created_at: new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  )
}))

export const generateDummyNewsData = async () => {
  try {
    const count = await prismaClient.news.count()
    if (count > 50) return
    await prismaClient.news.createMany({ data: newsData, skipDuplicates: true })

    const ch = await getRabbitChannel()

    const news = await prismaClient.news.findMany()

    for (const d of news) {
      ch.sendToQueue('news_index', Buffer.from(JSON.stringify(d)), { persistent: true })
    }

    console.info('Success generate dummy news data')
  } catch (error) {
    console.error('Failed to generate news data', error)
  }
}
