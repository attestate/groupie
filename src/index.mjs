// @format
import { resolve } from "path";
import { env } from "process";

import { Level } from "level";
import { boot } from "@attestate/crawler";

const startBlock = 16340083;
const endBlock = 9999999999999;

const TABLE_NAME = "USDT_TRANSFERS";
const db = new Level(TABLE_NAME, { valueEncoding: "json" });

const INDEX_PREFIX = TABLE_NAME;
const START_CURSOR_TRANSFERS = `${INDEX_PREFIX}_START`;
const END_CURSOR_TRANSFERS = `${INDEX_PREFIX}_END`;

async function moveCursor(nextValue) {
  const terminalSymbol = ":";
  nextValue = `${INDEX_PREFIX}${terminalSymbol}${nextValue}`;
  let cursor;
  try {
    cursor = await db.get(END_CURSOR_TRANSFERS);
  } catch (err) {
    if (err.code === "LEVEL_NOT_FOUND") {
      await db.put(START_CURSOR_TRANSFERS, nextValue);
      await db.put(END_CURSOR_TRANSFERS, nextValue);
      return;
    }
    throw err;
  }
  await db.put(cursor, nextValue);
  await db.put(END_CURSOR_TRANSFERS, nextValue);
}

async function loadHandler(line) {
  line = JSON.parse(line);
  for await (const log of line) {
    await moveCursor(log.transactionHash);
    await db.put(log.transactionHash, log);
  }
}
const crawlPath = [
  [
    {
      name: "call-block-logs",
      extractor: {
        args: [startBlock, endBlock],
      },
      transformer: {
        args: [
          resolve(env.DATA_DIR, "call-block-logs-extraction"),
          "0xdac17f958d2ee523a2206206994597c13d831ec7",
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        ],
      },
      loader: loadHandler,
    },
  ],
];

const config = {
  queue: {
    options: {
      concurrent: 1,
    },
  },
};
(async () => {
  // TODO: Before calling this upon newly starting the process, we should make
  // sure to clear the data directory.
  await boot(crawlPath, config);
})();
