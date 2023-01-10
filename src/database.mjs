// @format
import { Level } from "level";

export function provision(path, options, indexName) {
  if (!indexName) throw new Error(`"indexName" must be defined`);
  const db = new Level(path, options);
  return {
    connection: db,
    index: {
      terminal: ":",
      prefix: `${indexName}:`,
      start: `${indexName}_START`,
      end: `${indexName}_END`,
    },
  };
}

export function write(configuration) {
  const { connection, index } = configuration;
  return async (key, value) => {
    const indexKey = `${index.prefix}${key}`;
    let cursor;
    try {
      cursor = await connection.get(index.end);
    } catch (err) {
      if (err.code === "LEVEL_NOT_FOUND") {
        await connection.put(index.start, indexKey);
        await connection.put(index.end, indexKey);
        await connection.put(key, value);
        return;
      }
      throw err;
    }
    await connection.put(cursor, indexKey);
    await connection.put(index.end, indexKey);
    await connection.put(key, value);
  };
}
