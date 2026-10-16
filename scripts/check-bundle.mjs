import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Strings that only admin screens contain: they must not be in the main bundle of the storefront. */
const ADMIN_MARKERS = /admin\.(auth|categories|collections|products|articles|orders)\./;
const ASSETS_DIR = join('.output', 'public', 'assets');

const entries = existsSync(ASSETS_DIR) ? readdirSync(ASSETS_DIR).filter((name) => /^index-.*\.js$/.test(name)) : [];
const leaks = entries.filter((name) => ADMIN_MARKERS.test(readFileSync(join(ASSETS_DIR, name), 'utf8')));

if (entries.length === 0) {
  console.error('check-bundle: no entry bundle found, run `npm run build` first');
  process.exit(1);
}
if (leaks.length > 0) {
  console.error(`check-bundle: admin code leaked into the main bundle: ${leaks.join(', ')}`);
  process.exit(1);
}
console.log(`check-bundle: ok, the main bundle (${entries.join(', ')}) has no admin screens`);
