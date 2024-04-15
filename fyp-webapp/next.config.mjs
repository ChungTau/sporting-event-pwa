/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    env:{
        MapboxAccessToken: 'pk.eyJ1IjoiZWR3YXJkb25pb25jIiwiYSI6ImNsYnZ5amRzajAzcXUzbnJ3dXo4aXgzbmEifQ.nwp6x4W6ffop_GeCAtIE2g'
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'api.mapbox.com',
          },
          
        ],
      },
};

export default nextConfig;
