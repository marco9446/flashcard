function parseCSV(csv: string) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());
  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const entry: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || "";
    });
    return entry;
  });
  console.log("Parsed Dataset: ", { headers, data });
  return { headers, data };
}

export function uploadDataset(datasetCsv: string) {
  const parsedDataset = parseCSV(datasetCsv);
  // Here you can add logic to store the parsed dataset, e.g., in IndexedDB or localStorage
  console.log("Uploading Dataset: ", parsedDataset);
}
