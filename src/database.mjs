// @format
import { open } from "lmdb";

export function provision(path, indexName) {
  if (!indexName) throw new Error(`"indexName" must be defined`);
  const db = new open({
    path,
  });
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

export async function persist(configuration, epoch) {
  if (!epoch && epoch != 0)
    throw new Error(`epoch input must be defined: "${epoch}"`);
  const key = "epochkey";
  const { connection } = configuration;
  const local = await connection.get(key);
  if ((!local && local != 0) || epoch > local) {
    await connection.put(key, epoch);
    return epoch;
  }
  return local;
}

export function index(configuration) {
  const { connection, index } = configuration;
  return async (key, value) => {
    const indexKey = `${index.prefix}${key}`;
    const cursor = await connection.get(index.end);
    if (!cursor) {
      await connection.put(index.start, indexKey);
      await connection.put(index.end, indexKey);
      await connection.put(key, value);
      return;
    }
    await connection.put(cursor, indexKey);
    await connection.put(index.end, indexKey);
    await connection.put(key, value);
  };
}
