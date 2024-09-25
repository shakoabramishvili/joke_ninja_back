module.exports = {
    apps: [
      {
        name: 'joke-ninja',             // Name of your application
        script: 'dist/main.js',         // Path to the main script to run
        instances: 1,                   // Number of instances
        autorestart: true,              // Auto-restart if the app crashes
        watch: false,                   // Watch files for changes (optional)
        max_memory_restart: '1G',       // Restart if memory usage exceeds 1GB
        env: {                          // Default environment (development)
          NODE_ENV: 'development',
          MONGODB_USERNAME: 'shalvaabramishvili',
          MONGODB_PASSWORD: 'bkBXUZecNVFINJmF',
          MONGODB_DATABASE_NAME: 'joke_ninja_dev',
          MONGODB_URI: 'jokeninja.hpyzm.mongodb.net',
          JWT_SECRET: 'fdsfdsfds',
        },
        env_production: {               // Production environment variables
          NODE_ENV: 'production',
          MONGODB_USERNAME: 'your_production_username',  // Change these values accordingly
          MONGODB_PASSWORD: 'your_production_password',
          MONGODB_DATABASE_NAME: 'your_production_database_name',
          MONGODB_URI: 'your_production_uri',
          JWT_SECRET: 'your_production_jwt_secret',
        }
      }
    ]
  };