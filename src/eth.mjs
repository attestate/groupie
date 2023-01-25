// @format
import { env } from "process";

import { blockNumber as _blockNumber } from "eth-fun";

export async function blockNumber() {
  const options = {
    url: env.RPC_HTTP_HOST,
  };

  if (env.RPC_API_KEY) {
    options.headers = {
      Authorization: `Bearer ${env.RPC_API_KEY}`,
    };
  }

  return parseInt(await _blockNumber(options), 16);
}
