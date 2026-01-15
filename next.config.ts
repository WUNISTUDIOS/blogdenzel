// import createMDX from '@next/mdx'
// import type { NextConfig } from 'next'
//
// const nextConfig: NextConfig = {
//   output: "export",
//   basePath: '/blogdenzel',
//   images: {
//   unoptimized: true, // Required for static export
//   },
//   pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
//   trailingSlash: true,
// }
//
// const withMDX = createMDX({
//   extension: /\.(md|mdx)$/,
//     options: {
//     remarkPlugins: [],
//     rehypePlugins: [],
//   },
// })
//
// export default withMDX(nextConfig)
//
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: "export",
	basePath: '/blogdenzel',
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	trailingSlash: true,

	// Turbopack configuration (for dev with --turbo flag)
	turbopack: {
		rules: {
			'*.glsl': {
				loaders: ['raw-loader'],
				as: '*.js',
			},
		},
	},

	// Webpack configuration (for production builds)
	webpack: (config) => {
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/,
			exclude: /node_modules/,
			use: ['raw-loader'],
		});

		return config;
	},

	images: {
		unoptimized: true,
		domains: ['d6wod28es4wuu.cloudfront.net'],
	},
};

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
})

export default withMDX(nextConfig)
