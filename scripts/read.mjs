import { provision } from "../src/database.mjs";
import config from "../config.mjs";

(async () => {
  const path = "data/events";
  const { connection, index } = provision(path, config.database.index.prefix);

  const startKey = `${index.prefix}${index.terminal}`;
  for await (let { key, value } of connection.getRange({
    start: startKey,
  })) {
    const transaction = await connection.get(value);
    console.log(transaction);
  }
})();
