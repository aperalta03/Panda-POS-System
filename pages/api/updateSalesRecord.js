import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const newSale = req.body;
    const filePath = path.join(
      process.cwd(),
      "app",
      "data",
      "salesRecord.json"
    );

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading salesRecord.json:", err);
        return res.status(500).json({ message: "Error reading sales record" });
      }

      // Parse the existing data
      let salesRecord = JSON.parse(data || "[]");
      salesRecord.push(newSale);

      // Write the updated sales record back to salesRecord.json
      fs.writeFile(filePath, JSON.stringify(salesRecord, null, 2), (err) => {
        if (err) {
          console.error("Error writing to salesRecord.json:", err);
          return res
            .status(500)
            .json({ message: "Error writing sales record" });
        }
        res.status(200).json({ message: "Sale recorded successfully" });
      });
    });
  } else {
    // Only allow POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
