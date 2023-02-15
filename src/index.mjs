// @format
import { resolve } from "path";
import { rm } from "fs/promises";

import * as uuid from "uuid";
import { boot as run } from "@attestate/crawler";

import log from "./logger.mjs";

function sleep(time) {
  log(`Waiting for: "${time}" ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function loop(path) {
  const config = (await import(resolve(`${path}?${uuid.v4()}`))).default;
  await run(config);
  await rm(config.path[0].extractor.output.path);
  await rm(config.path[0].transformer.output.path);
  await sleep(config.groupie.interval);
  return await loop(path);
}
