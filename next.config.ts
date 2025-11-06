import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: "export",
  basePath: '/blogdenzel',
  images: {
  unoptimized: true, // Required for static export
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  trailingSlash: true,
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
    options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)