// @format
import { resolve } from "path";
import { env } from "process";

import { boot } from "@attestate/crawler";
import * as blockLogs from "@attestate/crawler-call-block-logs";

//import config from "../config.mjs";
import { provision, write } from "./database.mjs";

const range = {
  start: 16370086,
  end: 16370087,
};

const path = `${env.DATA_DIR}/events/`;
const options = { valueEncoding: "json" };
const indexName = "test";
const db = provision(path, options, indexName);
const cursor = write(db);

async function loadHandler(line) {
  line = JSON.parse(line);
  for await (const log of line) {
    console.log(log.transactionHash);
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

const config = {
  queue: {
    options: {
      concurrent: 1,
    },
  },
};

(async () => {
  // //keccak - 256("Transfer(address,address,uint256)") == "0xddf...";
  const topic0 =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
  const topic1 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const path = crawlPath(range.start, range.end, topic0, topic1);
  await boot(path, config);
})();
