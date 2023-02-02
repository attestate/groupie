// @format
import { resolve } from "path";
import { env } from "process";

import { boot as crawl } from "@attestate/crawler";
import * as blockLogs from "@attestate/crawler-call-block-logs";

import log from "./logger.mjs";
import config from "../config.mjs";
import * as db from "./database.mjs";
import * as eth from "./eth.mjs";

const path = `${env.DATA_DIR}/events/`;
const conn = db.provision(path, config.database.index.prefix);
const cursor = db.index(conn);

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
      module: blockLogs.extractor,
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
  const blockNumber = {
    remote: await eth.blockNumber(),
  };

  try {
    blockNumber.local = await db.blockNumber(conn);
  } catch (err) {
    blockNumber.local = config.blocks.start;
  }

  if (blockNumber.local === blockNumber.remote) return;
  log(
    `Running from start "${blockNumber.local}" to end "${blockNumber.remote}"`
  );
  const path = crawlPath(
    blockNumber.local,
    blockNumber.remote,
    config?.contract?.address,
    config?.topics,
    config.blocks.stepSize
  );
  await crawl(path, config.crawler);
}
