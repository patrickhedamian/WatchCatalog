import {
  isUniqueProductNumber,
  isValidWatch,
  readWatches,
  writeWatches,
} from "../../../src/lib/watchData";

export default async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "A valid watch ID is required." });
  }

  try {
    const watches = await readWatches();
    const watch = watches.find((record) => record.id === id);

    if (req.method === "GET") {
      return watch
        ? res.status(200).json(watch)
        : res.status(404).json({ error: `Watch ${id} was not found.` });
    }

    if (req.method === "PUT") {
      if (!watch) return res.status(404).json({ error: `Watch ${id} was not found.` });
      if (!isValidWatch(req.body) || Number(req.body.id) !== id) {
        return res.status(400).json({ error: "A valid watch record with a matching ID is required." });
      }
      if (!isUniqueProductNumber(watches, req.body.productNumber, id)) {
        return res.status(409).json({ error: "Product number must be unique." });
      }
      const updatedWatch = { ...req.body, id, featured: watch.featured };
      await writeWatches(watches.map((record) => record.id === id ? updatedWatch : record));
      return res.status(200).json(updatedWatch);
    }

    if (req.method === "DELETE") {
      if (!watch) return res.status(404).json({ error: `Watch ${id} was not found.` });
      await writeWatches(watches.filter((record) => record.id !== id));
      return res.status(200).json({ id });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error(`/api/watches/${id} error:`, error);
    return res.status(500).json({ error: "Unable to update watch catalog data." });
  }
}
