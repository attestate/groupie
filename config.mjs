// @format
const config = {
  blocks: {
    start: 16485134,
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
export default config;
