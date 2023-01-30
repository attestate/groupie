// @format
import { run } from "./worker.mjs";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function loop() {
  await run();
  await sleep(3000);
  return await loop();
}

(async () => {
  await loop();
})();
