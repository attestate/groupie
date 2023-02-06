// @format
import { env } from "process";

const config = {
  database: {
    path: `${env.DATA_DIR}/events/`,
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
    // TODO: This should allow many more contract addresses.
    address: "0x0bC2A24ce568DAd89691116d5B34DEB6C203F342",
  },
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  ],
  crawler: {
    queue: {
      options: {
        concurrent: parseInt(env.EXTRACTION_WORKER_CONCURRENCY, 10),
      },
    },
  },
};
export default config;
