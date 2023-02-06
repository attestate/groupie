// @format
import test from "ava";

import { validate } from "../src/index.mjs";

test("json schema validation", (t) => {
  const config = {
    database: {
      path: `data/events/`,
      index: {
        prefix: "events",
      },
    },
    blocks: {
      start: 14566826,
      stepSize: 10000,
      interval: 5000,
    },
    contract: {
      address: "0x0bC2A24ce568DAd89691116d5B34DEB6C203F342",
    },
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    crawler: {
      queue: {
        options: {
          concurrent: 1,
        },
      },
    },
  };
  validate(config);
  t.pass();
});

test("json schema validation throws on invalid config", (t) => {
  const config = {
    database: {
      path: `data/events/`,
      index: {
        prefix: "events",
      },
    },
  };
  t.throws(() => validate(config));
});
