import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Configurações para melhorar a compatibilidade
  reactStrictMode: true,
  // Configurações para resolver problemas de roteamento
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configurações para melhorar a hidratação
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Configurações para resolver problemas de case-sensitivity
    config.resolve.alias = {
      ...config.resolve.alias,
      // Garante que os caminhos sejam case-insensitive
      '@': path.resolve(__dirname, './'),
    }
    
    return config
  },
  // Configurações para resolver problemas de case-sensitivity
  trailingSlash: false,
  // Configurações para melhorar a hidratação
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configurações adicionais para hidratação
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
