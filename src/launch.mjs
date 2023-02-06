import "dotenv/config";
import configuration from "../config.example.mjs";
import { launch } from "./index.mjs";

(async () => {
  await launch(configuration);
})();
