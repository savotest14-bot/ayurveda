module.exports = {
  apps: [
    {
      name: 'vershaayurveda-api',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      merge_logs: true
    }
  ]
};
