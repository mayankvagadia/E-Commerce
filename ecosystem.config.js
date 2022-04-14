module.exports = {
  apps: [{
    name: 'maxy-media',
    script: 'bin/www',
    node_args: " --max_old_space_size=3072",
    watch: ['common', 'config', 'helpers', 'models', 'views', 'routes', 'app.js'],
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    env: {
      COMMON_VARIABLE: 'true'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }, 
  // {
  //   name: 'maxy-media-cron',
  //   script: 'cron.js',
  //   node_args: " --max_old_space_size=3072",
  //   watch: ['common', 'config', 'helpers', 'models', 'views', 'routes', 'cron.js'],
  //   log_date_format: "YYYY-MM-DD HH:mm:ss",
  //   env: {
  //     COMMON_VARIABLE: 'true'
  //   },
  //   env_production: {
  //     NODE_ENV: 'production'
  //   }
  // }
],
};