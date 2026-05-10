import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DLD – Dental Live Dashboard',
    short_name: 'DLD',
    description: 'Clinical inventory management for dental clinics',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F9F9FF',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
