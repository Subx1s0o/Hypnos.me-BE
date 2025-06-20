// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os');
const cpuCount = os.cpus().length;

let GATEWAY_INSTANCES = 1;
let WORKER_INSTANCES = 1;

if (cpuCount == 4) {
  WORKER_INSTANCES = 2;
  GATEWAY_INSTANCES = 2;
} else if (cpuCount == 8) {
  WORKER_INSTANCES = 2;
  GATEWAY_INSTANCES = 6;
} else if (cpuCount == 16) {
  WORKER_INSTANCES = 4;
  GATEWAY_INSTANCES = 12;
}

module.exports = {
  apps: [
    {
      name: 'GATEWAY',
      script: './dist/main.js',
      instances: GATEWAY_INSTANCES,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      node_args: '--async-stack-traces',
      combine_logs: true,
      env: {
        NODE_ENV: 'production',
        ROLE: 'GATEWAY',
      },
    },
    {
      name: 'WORKER',
      script: './dist/main.js',
      instances: WORKER_INSTANCES,
      autorestart: true,
      watch: false,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      node_args: '--async-stack-traces',
      combine_logs: true,
      env: {
        NODE_ENV: 'production',
        ROLE: 'WORKER',
      },
    },
  ],
};
