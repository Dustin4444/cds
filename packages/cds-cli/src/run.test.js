import assert from 'node:assert/strict';

import { runCli } from './run';

const jsonSearch = runCli(['search', 'icon', 'shield', '--limit', '5', '--json']);
assert.equal(jsonSearch.exitCode, 0);

const parsedJsonSearch = JSON.parse(jsonSearch.stdout);
assert.ok(parsedJsonSearch.results.length <= 5);
assert.ok(parsedJsonSearch.results.some((result) => result.name === 'securityShield'));

const aliasSearch = runCli(['search-icon', 'wallet']);
assert.equal(aliasSearch.exitCode, 0);
assert.ok(aliasSearch.stdout.includes('Found'));

const missingQuery = runCli(['search', 'icon']);
assert.equal(missingQuery.exitCode, 1);
assert.ok(missingQuery.stderr?.includes('Missing query'));

console.log('cds-cli tests passed');
