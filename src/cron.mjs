// @format
import { run } from "./worker.mjs";
import log from "./logger.mjs";

function sleep(time) {
  log(`Waiting for: "${time}" ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function start(config) {
  await run(config);
  await sleep(config.blocks.interval);
  return await start(config);
}
