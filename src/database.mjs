// @format
import { open } from "lmdb";

import log from "./logger.mjs";

export function provision(path, indexName) {
  if (!indexName) throw new Error(`"indexName" must be defined`);
  const db = new open({
    path,
  });
  return {
    connection: db,
    index: {
      terminal: ":",
      prefix: `${indexName}`,
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
    log(`Persisting epoch: ${epoch}`);
    await connection.put(key, epoch);
    return epoch;
  }
  return local;
}

export function index(configuration) {
  const { connection, index } = configuration;
  return async (value) => {
    const lgIndex = `${index.prefix}${index.terminal}${value.blockNumber}${index.terminal}${value.transactionIndex}`;
    await connection.put(lgIndex, value.transactionHash);
    await connection.put(value.transactionHash, value);
  };
}
