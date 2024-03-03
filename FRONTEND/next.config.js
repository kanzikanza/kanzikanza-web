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

module.exports = nextConfig
