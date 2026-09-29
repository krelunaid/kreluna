import { access, cp, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Sites discovers Vinext server modules under dist/server. Keep the build's
// paths intact and put its hosting metadata at the archive root as required.
const archive = resolve(process.argv[2] || join(tmpdir(), 'kreluna-sites.tar.gz'));
await access('dist/server/index.js');
await access('dist/client/index.html');
await access('dist/.openai/hosting.json');
await mkdir(dirname(archive), { recursive: true });

const staging = await mkdtemp(join(tmpdir(), 'kreluna-sites-package-'));
try {
  await cp('dist', join(staging, 'dist'), { recursive: true });
  await cp('dist/.openai', join(staging, '.openai'), { recursive: true });
  const result = spawnSync('tar', ['-czf', archive, '-C', staging, '.openai', 'dist'], {
    env: { ...process.env, COPYFILE_DISABLE: '1' },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Sites archive failed (${result.status})`);
  console.log(`Sites deployment archive: ${archive}`);
} finally {
  await rm(staging, { recursive: true, force: true });
}
