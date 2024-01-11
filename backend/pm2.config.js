module.exports = {
    apps: [
      {
        name: 'sporting-event-pwa',
        script: 'dist/index.js', // Adjust this to your entry point
        watch: true,
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  