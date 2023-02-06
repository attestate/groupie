// @format
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

import Ajv from "ajv";

import { run } from "./worker.mjs";
import configuration from "./schemata/configuration.mjs";
import log from "./logger.mjs";

const __filename = fileURLToPath(import.meta.url);

function sleep(time) {
  log(`Waiting for: "${time}" ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function validate(config) {
  const ajv = new Ajv();
  const validate = ajv.compile(configuration);
  const valid = validate(config);
  if (!valid) {
    console.log(config, validate.errors);
    throw new Error("Received invalid config");
  }
}

export async function loop(config) {
  validate(config);
  await run(config);
  await sleep(config.blocks.interval);
  return await loop(config);
}

if (!isMainThread) {
  parentPort.on("message", async () => await launch(workerData.config));
}
export async function launch(config) {
  if (isMainThread) {
    log("Relaunching as worker thread");
    const worker = new Worker(__filename, {
      workerData: {
        config,
      },
    });
    worker.postMessage("start");
  } else {
    log("Relaunching as worker thread");
    validate(config);
    await loop(config);
  }
}
