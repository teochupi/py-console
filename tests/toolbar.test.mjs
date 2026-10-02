import {test} from 'node:test';
import assert from 'node:assert/strict';
import {insertion} from '../src/toolbar.mjs';
test('pairs place cursor inside and wrap selection',()=>{for(const key of ['()','[]','{}','"',"'"]){const c=insertion('hello',0,5,key);assert.equal(c.insert.slice(1,-1),'hello');assert.equal(c.anchor,1);assert.equal(c.head,6);const empty=insertion('',0,0,key);assert.equal(empty.anchor,1);assert.equal(empty.head,1);}});
test('TAB inserts four spaces at cursor',()=>assert.deepEqual(insertion('ab',1,1,'TAB'),{from:1,to:1,insert:'    ',anchor:5,head:5}));

