import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Define the path to the salesRecord.json file
    const filePath = path.join(process.cwd(), 'app', 'context', 'salesRecord.json');

    // Read the file
    const data = fs.readFileSync(filePath, 'utf8');

    // Return the JSON data as the response
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading salesRecord.json:', error);
    res.status(500).json({ error: 'Failed to read sales record' });
  }
}