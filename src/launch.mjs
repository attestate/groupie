import "dotenv/config";
import { argv } from "process";
import { loop } from "./index.mjs";

(async () => {
  const configPath = process.argv[2];
  if (!configPath) throw new Error("config path as first argument missing");
  await loop(configPath);
})();
