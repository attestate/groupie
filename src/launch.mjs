// @format
import { start } from "./cron.mjs";
import config from "../config.mjs";

(async () => {
  await start(config);
})();
