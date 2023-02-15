// @format
import { open } from "lmdb";
import { database } from "@attestate/crawler";

export function init(path, table) {
  const db = new open({ path });
  return db.openDB(table);
}

export async function blockNumber(db, key) {
  const elem = await database.last(db, key);
  if (!elem) throw new Error("No last element in index found");
  const [blockNumber] = elem.key;
  return parseInt(blockNumber, 16);
}
