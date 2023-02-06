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

export async function all(configuration) {
  const { connection, index } = configuration;
  const key = `${index.prefix}${index.terminal}0x`;
  return Array.from(await connection.getRange(key));
}

export async function last(configuration) {
  const results = await all(configuration);
  return results[results.length - 1];
}

export async function blockNumber(configuration) {
  const elem = await last(configuration);
  if (!elem) throw new Error("No last element in index found");
  const matcher = new RegExp(
    `${configuration.index.prefix}:(0x[a-fA-F0-9]+):0x[a-fA-F0-9]+`
  );
  const blockNumber = elem.key.match(matcher);
  if (!blockNumber)
    throw new Error("No block number in last element's key found");
  return parseInt(blockNumber[1], 16);
}

export function index(configuration) {
  const { connection, index } = configuration;
  return async (value) => {
    const lgIndex = `${index.prefix}${index.terminal}${value.blockNumber}${index.terminal}${value.transactionIndex}`;
    await connection.put(lgIndex, value.transactionHash);
    await connection.put(value.transactionHash, value);
  };
}
