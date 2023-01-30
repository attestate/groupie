// @format
import { resolve } from "path";
import { env } from "process";

import { boot as crawl } from "@attestate/crawler";
import * as blockLogs from "@attestate/crawler-call-block-logs";

import log from "./logger.mjs";
import config from "../config.mjs";
import { persist, provision, index } from "./database.mjs";
import { blockNumber } from "./eth.mjs";

const path = `${env.DATA_DIR}/events/`;
// TODO: Change this value to something else
const indexName = "test";
const db = provision(path, indexName);
const cursor = index(db);
const bnCursor = (
  (db) => (blockNumber) =>
    persist(db, blockNumber)
)(db);

async function loadHandler(line) {
  line = JSON.parse(line);
  for await (const log of line) {
    await cursor(log);
  }
}

const crawlPath = (start, end, address, topics, stepSize) => [
  {
    name: "call-block-logs",
    extractor: {
      module: {
        init: blockLogs.extractor.init,
        update: async (message) => {
          const { fromBlock } = message.params[0];
          // PROBLEM: If we always persist the biggest seen number, then upon
          // crashing within a crawl, we could be missing some blocks that
          // haven't passed this stage yet.
          await bnCursor(parseInt(fromBlock, 16));
          return blockLogs.extractor.update(message);
        },
      },
      args: [start, end, address, topics, stepSize],
      output: {
        path: resolve(env.DATA_DIR, "call-block-logs-extraction"),
      },
    },
    transformer: {
      module: blockLogs.transformer,
      args: [],
      input: {
        path: resolve(env.DATA_DIR, "call-block-logs-extraction"),
      },
      output: {
        path: resolve(env.DATA_DIR, "call-block-logs-transformation"),
      },
    },
    loader: {
      handler: loadHandler,
      input: {
        path: resolve(env.DATA_DIR, "call-block-logs-transformation"),
      },
    },
  },
];

export async function run() {
  const localBlockNumber = await persist(db, config.blocks.start);
  const latestBlockNumber = await blockNumber();
  if (localBlockNumber === latestBlockNumber) return;
  log(`Running from start "${localBlockNumber}" to end "${latestBlockNumber}"`);
  const path = crawlPath(
    localBlockNumber,
    latestBlockNumber,
    config?.contract?.address,
    config?.topics,
    config.blocks.stepSize
  );
  await crawl(path, config.crawler);
  await persist(db, latestBlockNumber);
}
