// @format
import { rmSync } from "fs";

import test from "ava";

import { provision, index, all, last, blockNumber } from "../src/database.mjs";

test.serial("if blockNumber fails on non existent entries", async (t) => {
  const path = "./testdb";
  const indexName = "test";
  const configuration = provision(path, indexName);
  const { connection } = configuration;
  await t.throwsAsync(async () => await blockNumber(configuration));
  rmSync(path, { recursive: true });
});

test.serial("getting last block number", async (t) => {
  const path = "./testdb";
  const indexName = "test";
  const configuration = provision(path, indexName);
  const { connection } = configuration;
  const key = `${indexName}:0xfc67f3:0x00`;
  const value = "hello world";
  await connection.put(key, value);
  const result = await blockNumber(configuration);
  t.is(result, 16541683);
  rmSync(path, { recursive: true });
});

test.serial("getting all entries", async (t) => {
  const path = "./testdb";
  const indexName = "test";
  const configuration = provision(path, indexName);
  const { connection } = configuration;
  const key = "indexName:0xfc67f3:0x00";
  const value = "hello world";
  await connection.put(key, value);
  const results = await all(configuration);
  t.is(results[0].key, key);
  t.is(results[0].value, value);
  rmSync(path, { recursive: true });
});

test.serial("getting last entry", async (t) => {
  const path = "./testdb";
  const indexName = "test";
  const configuration = provision(path, indexName);
  const { connection } = configuration;

  const key0 = "indexName:0xfc67f3:0x00";
  const value0 = "hello world";
  await connection.put(key0, value0);

  const key1 = "indexName:0xfc67f3:0x01";
  const value1 = "hallo welt";
  await connection.put(key1, value1);

  const results = await last(configuration);
  t.is(results.key, key1);
  t.is(results.value, value1);
  rmSync(path, { recursive: true });
});
