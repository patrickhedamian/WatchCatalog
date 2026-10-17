import {
  isUniqueProductNumber,
  isValidWatch,
  readWatches,
  writeWatches,
} from "../../../src/lib/watchData";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).json(await readWatches());
    }

    if (req.method === "POST") {
      if (!isValidWatch(req.body)) {
        return res.status(400).json({ error: "A valid watch record is required." });
      }
      const watches = await readWatches();
      if (!isUniqueProductNumber(watches, req.body.productNumber)) {
        return res.status(409).json({ error: "Product number must be unique." });
      }
      const id = watches.reduce((highest, watch) => Math.max(highest, watch.id), 0) + 1;
      const newWatch = { ...req.body, id, featured: false };
      await writeWatches([newWatch, ...watches]);
      return res.status(201).json(newWatch);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("/api/watches error:", error);
    return res.status(500).json({ error: "Unable to access watch catalog data." });
  }
}
