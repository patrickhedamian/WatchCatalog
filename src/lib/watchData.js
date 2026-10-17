import { readFile, writeFile } from "fs/promises";
import path from "path";

const databasePath = path.join(process.cwd(), "db.json");

export async function readWatches() {
  const database = JSON.parse(await readFile(databasePath, "utf8"));
  if (!Array.isArray(database.watches)) {
    throw new Error("db.json must contain a watches array.");
  }
  return database.watches;
}

export async function writeWatches(watches) {
  await writeFile(databasePath, `${JSON.stringify({ watches }, null, 2)}\n`, "utf8");
}

export function isValidWatch(watch) {
  return (
    watch &&
    typeof watch.productNumber === "string" &&
    watch.productNumber.trim() &&
    typeof watch.name === "string" &&
    watch.name.trim() &&
    typeof watch.model === "string" &&
    watch.model.trim() &&
    Number.isFinite(Number(watch.price)) &&
    Number(watch.price) > 0 &&
    typeof watch.shortDescription === "string" &&
    watch.shortDescription.trim() &&
    typeof watch.fullDescription === "string" &&
    watch.fullDescription.trim() &&
    typeof watch.imageUrl === "string" &&
    watch.imageUrl.trim() &&
    typeof watch.caliberAndMovement === "string" &&
    watch.caliberAndMovement.trim() &&
    typeof watch.chronograph === "boolean" &&
    ["weight", "height", "diameter", "thickness"].every(
      (field) => Number.isFinite(Number(watch[field])) && Number(watch[field]) > 0,
    ) &&
    Number.isInteger(Number(watch.jewel)) &&
    Number(watch.jewel) >= 0 &&
    typeof watch.caseMaterial === "string" &&
    watch.caseMaterial.trim() &&
    typeof watch.strapMaterial === "string" &&
    watch.strapMaterial.trim()
  );
}

export function isUniqueProductNumber(watches, productNumber, ignoreId) {
  const normalizedNumber = productNumber.trim().toLowerCase();
  return !watches.some(
    (watch) => watch.id !== ignoreId && watch.productNumber.trim().toLowerCase() === normalizedNumber,
  );
}
