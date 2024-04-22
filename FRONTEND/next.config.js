const {
  createVanillaExtractPlugin
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/fonts/:slug*',
            destination: 'https://accounts.kakaocdn.net/fonts/:slug*',
          },
        ]
      },
    
}

module.exports = withVanillaExtract(nextConfig);
