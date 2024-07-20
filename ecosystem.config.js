module.exports = {
  apps: [
    {
      name: 'node-app', // pm2 start App name
      script: 'pnpm',
      cwd: '/home/ubuntu/rebridge-be',
      args: 'run dev',
      exec_mode: 'cluster', // 'cluster' or 'fork'
      instance_var: 'INSTANCE_ID', // instance variable
      instances: 1, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ['node_modules', 'logs'], // ignore files change
      max_memory_restart: '800M', // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: './logs/access.log', // pm2 log file
      error: './logs/error.log', // pm2 error log file
    },
  ],
}
