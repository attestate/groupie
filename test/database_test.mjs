// @format
import { rmdirSync } from "fs";

import test from "ava";

import { provision, write } from "../src/database.mjs";

test("writing of database and index", async (t) => {
  const path = "./testdb";
  const options = { valueEncoding: "json" };
  const indexName = "test";
  const configuration = provision(path, options, indexName);

  const keys = ["a", "b", "c"];
  const values = ["1", "2", "3"];

  const cursor = write(configuration);
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
  rmdirSync(path, { recursive: true });
});
