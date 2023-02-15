import { env } from "process";
import { resolve } from "path";

import { database } from "@attestate/crawler";
import * as blockLogs from "@attestate/crawler-call-block-logs";

import { blockNumbers } from "./src/state.mjs";

const address = "0x0bC2A24ce568DAd89691116d5B34DEB6C203F342";
const topics = [
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
];
const outputDbPath = resolve(env.DATA_DIR, "call-block-logs-load");
const name = "call-block-logs";
const table = `${name}${database.SEPARATOR}${database.MARKER_ORDER}`;
const defaultStartBlock = 14566826;
const range = await blockNumbers(outputDbPath, table, defaultStartBlock);
const stepSize = 10000;
export default {
  groupie: {
    interval: 5000,
  },
  path: [
    {
      name,
      extractor: {
        module: blockLogs.extractor,
        args: [range.start, range.end, address, topics, stepSize],
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
        module: blockLogs.loader,
        input: {
          path: resolve(env.DATA_DIR, "call-block-logs-transformation"),
        },
        output: {
          path: outputDbPath,
        },
      },
    },
  ],
  queue: {
    options: {
      concurrent: 100,
    },
  },
};
