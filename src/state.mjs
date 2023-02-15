// @format
import * as database from "./database.mjs";
import * as eth from "./eth.mjs";
import log from "./logger.mjs";

export async function blockNumbers(path, table, defaultNumber) {
  const blockNumber = {
    remote: await eth.blockNumber(),
  };

  const db = database.init(path, table);

  try {
    blockNumber.local = await database.blockNumber(db, "");
  } catch (err) {
    log(
      `Couldn't find local block number, using default start block number: "${defaultNumber}", error: "${err.toString()}"`
    );
    blockNumber.local = defaultNumber;
  }

  if (blockNumber.local === blockNumber.remote) return;
  log(
    `Running from start "${blockNumber.local}" to end "${blockNumber.remote}"`
  );
  return {
    start: blockNumber.local,
    end: blockNumber.remote,
  };
}
