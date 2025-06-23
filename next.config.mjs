/** @type {import('next').NextConfig} */
const nextConfig = {
   
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'authjs.dev',
        port: '',
        pathname: '/img/providers/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
        search: '',
      },
    ],
 
}
};

export default nextConfig;

