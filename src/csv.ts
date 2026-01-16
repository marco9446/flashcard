import { type CardItem, type Dataset } from "./storage";

export function parseCSV(name: string, content: string): Dataset {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header and one data row.");
  }

  const header = lines[0].split(",").map((h) => h.trim());
  if (header.length < 2) {
    throw new Error("CSV must have at least two columns.");
  }

  const columns: [string, string] = [header[0], header[1]];
  const items: CardItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((v) => v.trim());
    if (row.length < 2) continue;

    const values: Record<string, string> = {};
    values[columns[0]] = row[0];
    values[columns[1]] = row[1];

    items.push({
      id: crypto.randomUUID(),
      values,
      totalViews: 0,
      stats: {},
    });
  }

  return {
    name,
    columns,
    items,
    createdAt: Date.now(),
  };
}
