// @format
import { rmSync } from "fs";

import test from "ava";

import { provision, index, persist } from "../src/database.mjs";

test.serial("persisting epoch", async (t) => {
  const path = "./testdb";
  const indexName = "test";
  const configuration = provision(path, indexName);

  const key = "epochkey";
  const epoch0 = await persist(configuration, 0);
  t.is(epoch0, 0);
  const value0 = await configuration.connection.get(key);
  t.is(value0, 0);

  const epoch1 = await persist(configuration, 0);
  t.is(epoch1, 0);
  const value1 = await configuration.connection.get(key);
  t.is(value1, 0);

  const epoch2 = await persist(configuration, 10);
  t.is(epoch2, 10);
  const value2 = await configuration.connection.get(key);
  t.is(value2, 10);

  const epoch3 = await persist(configuration, 10);
  t.is(epoch3, 10);
  const value3 = await configuration.connection.get(key);
  t.is(value3, 10);

  rmSync(path, { recursive: true });
});

test.serial("writing of database and index", async (t) => {
  const path = "./testdb";
  const indexName = "test";
  const configuration = provision(path, indexName);

  const keys = ["a", "b", "c"];
  const values = ["1", "2", "3"];

  const cursor = index(configuration);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];
    await cursor(key, value);
  }

  const { connection } = configuration;
  t.is(values[0], await connection.get(keys[0]));
  t.is(values[1], await connection.get(keys[1]));
  t.is(values[2], await connection.get(keys[2]));
  t.is(`${indexName}:${keys[0]}`, await connection.get(`${indexName}_START`));
  t.is(`${indexName}:${keys[2]}`, await connection.get(`${indexName}_END`));
  t.is(
    `${indexName}:${keys[1]}`,
    await connection.get(`${indexName}:${keys[0]}`)
  );
  t.is(
    `${indexName}:${keys[2]}`,
    await connection.get(`${indexName}:${keys[1]}`)
  );
  rmSync(path, { recursive: true });
});
