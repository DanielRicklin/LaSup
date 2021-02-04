module.exports = {
  apps : [
      {
        name: "lasup",
        script: "./bin/www",
        increment_var : 'INSTANCE_ID',
        env: {
            "PORT": 5000
        }
      }
  ]
}
