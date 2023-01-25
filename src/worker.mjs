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
const indexName = "test";
const db = provision(path, indexName);
const cursor = index(db);

async function loadHandler(line) {
  line = JSON.parse(line);
  for await (const log of line) {
    await cursor(log.transactionHash, log);
  }
}

const crawlPath = (start, end, topic0, topic1) => [
  {
    name: "call-block-logs",
    extractor: {
      module: blockLogs.extractor,
      args: [start, end],
      output: {
        path: resolve(env.DATA_DIR, "call-block-logs-extraction"),
      },
    },
    transformer: {
      module: blockLogs.transformer,
      args: [topic0, topic1],
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
    config.topics[0],
    config.topics[1]
  );
  await crawl(path, config.crawler);
  await persist(db, latestBlockNumber);
}
