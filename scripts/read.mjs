import { persist, provision, index } from "../src/database.mjs";

(async () => {
  const path = "data/events";
  const { connection } = provision(path, "test");

  for (let { key, value } of connection.getRange({
    start: "test:",
  })) {
    console.log(value);
  }
})();
