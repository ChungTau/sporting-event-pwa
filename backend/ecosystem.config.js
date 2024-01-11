module.exports = {
    apps: [
      {
        name: 'sporting-event-pwa',
        script: 'dist/index.js', // Adjust this to your entry point
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        },
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        error_file: 'logs/error.log', // Set the path for error logs
        out_file: 'logs/out.log',     // Set the path for regular logs
        merge_logs: true,
      },
    ],
  };
  