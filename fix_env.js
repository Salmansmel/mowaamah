const { spawnSync } = require('child_process');

const key = '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';

function addEnv(env) {
  console.log(`Adding to ${env}...`);
  const child = spawnSync('npx', ['vercel', 'env', 'add', 'NVIDIA_API_KEY', env], {
    input: key,
    encoding: 'utf-8',
    shell: true
  });
  console.log(child.stdout);
  if (child.stderr) console.error(child.stderr);
}

// First remove the corrupted ones
console.log("Removing old keys...");
spawnSync('npx', ['vercel', 'env', 'rm', 'NVIDIA_API_KEY', 'production', '--yes'], { shell: true, stdio: 'inherit' });
spawnSync('npx', ['vercel', 'env', 'rm', 'NVIDIA_API_KEY', 'preview', '--yes'], { shell: true, stdio: 'inherit' });
spawnSync('npx', ['vercel', 'env', 'rm', 'NVIDIA_API_KEY', 'development', '--yes'], { shell: true, stdio: 'inherit' });

// Add fresh
addEnv('production');
addEnv('preview');
addEnv('development');
