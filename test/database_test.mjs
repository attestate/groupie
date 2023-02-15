// @format
import { rmSync } from "fs";

import test from "ava";

import { init, blockNumber } from "../src/database.mjs";

test.serial("if blockNumber fails on non existent entries", async (t) => {
  const path = "./testdb";
  const table = "test";
  const key = "0xabc";
  const db = init(path, table);
  await t.throwsAsync(async () => await blockNumber(db, key));
  rmSync(path, { recursive: true });
});

test.serial("getting last block number", async (t) => {
  const path = "./testdb";
  const table = "test";
  const key = ["0xfc67f3", "0x00"];
  const value = "hello world";
  const db = init(path, table);
  await db.put(key, value);
  const result = await blockNumber(db, key);
  t.is(result, 16541683);
  rmSync(path, { recursive: true });
});
