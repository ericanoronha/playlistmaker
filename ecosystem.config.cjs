module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './apps/backend',
      script: 'cmd',
      args: '/c npm run dev',
      interpreter: 'cmd.exe',
    },
    {
      name: 'frontend',
      cwd: './apps/frontend',
      script: 'cmd',
      args: '/c npm run dev',
      interpreter: 'cmd.exe',
    },
  ],
};
