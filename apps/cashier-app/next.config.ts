import { join } from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // standalone output (used by Dockerfile) — trace from monorepo root so workspace packages are included
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
