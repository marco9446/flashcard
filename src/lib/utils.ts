import { storageService, type Dataset, type CardItem } from "../storage";

function parseCSV(csv: string) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return null;

  const headers = lines[0].split(",").map((header) => header.trim());
  const items: CardItem[] = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const valueRecord: Record<string, string> = {};
    headers.forEach((header, index) => {
      valueRecord[header] = values[index] || "";
    });
    return {
      id: crypto.randomUUID(),
      values: valueRecord,
      correctCount: 0,
      wrongCount: 0,
    };
  });
  return { headers, items };
}

export async function uploadDataset(datasetCsv: string, name?: string) {
  const result = parseCSV(datasetCsv);
  if (!result) return;

  const dataset: Dataset = {
    id: crypto.randomUUID(),
    name: name || `Dataset ${new Date().toLocaleString()}`,
    createdAt: Date.now(),
    columns: result.headers,
    items: result.items,
  };

  await storageService.saveDataset(dataset);
  console.log("Dataset saved to IndexedDB:", dataset);
}
