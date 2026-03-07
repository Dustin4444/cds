import assert from 'node:assert/strict';

import { searchIcons } from './iconSearch';

const exactNameResult = searchIcons('hiddenEye', 5);
assert.equal(exactNameResult.results[0]?.name, 'hiddenEye');
assert.ok(exactNameResult.results[0]?.matchedBy.includes('name'));

const keywordResult = searchIcons('shield', 20);
assert.ok(keywordResult.results.some((result) => result.name === 'securityShield'));
assert.ok(keywordResult.results.some((result) => result.matchedBy.includes('keyword')));

const aliasResult = searchIcons('predictions', 5);
assert.ok(aliasResult.results.some((result) => result.name === 'crystalBall'));
assert.ok(
  aliasResult.results.some(
    (result) => result.name === 'crystalBall' && result.matchedBy.includes('alias'),
  ),
);

const emptyResult = searchIcons('query-that-should-not-match-any-icon');
assert.equal(emptyResult.results.length, 0);

console.log('iconSearch tests passed');
