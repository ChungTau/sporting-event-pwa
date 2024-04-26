import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  scope: "/app",
  sw: "service-worker.js",
});

const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
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

export default withPWA(nextConfig);
