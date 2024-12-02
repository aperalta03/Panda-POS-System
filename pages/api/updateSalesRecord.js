import database from "../../utils/database";
import fs from "fs";
import path from "path";

/**
 * Handles an incoming POST request to record a new sale in the database.
 *
 * @async
 * @function handler
 * @param {import('next').NextApiRequest} req - The incoming request.
 * @param {import('next').NextApiResponse} res - The response to send.
 * @param {string} req.body.saleDate - The date of the sale in ISO format (YYYY-MM-DD).
 * @param {string} req.body.saleTime - The time of the sale in ISO format (HH:MM:SS).
 * @param {number} req.body.totalPrice - The total price of the sale, including applicable taxes.
 * @param {number} req.body.employeeID - The ID of the employee who made the sale.
 * @param {string} req.body.source - The source of the sale (e.g., "In-store", "Online").
 * @param {Array<{plateSize: string, components: string[]}>} req.body.orders - The items sold in the sale, including plate sizes and their respective components.
 * @returns {void} Responds with a success message and HTTP status code 200 on success, or an appropriate error message on failure.
 * @throws {Error} If there is an issue writing the sales record to the database.
 * @author Brandon Batac
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { saleDate, saleTime, totalPrice, employeeID, source, orders } =
      req.body;

    if (!saleDate || !saleTime || !employeeID) {
      console.error(
        "Missing saleDate, saleTime, or employeeID in request body"
      );
      return res.status(400).json({
        error: "Missing required fields: saleDate, saleTime, or employeeID",
      });
    }

    try {
      const filePath = path.join(
        process.cwd(),
        "utils",
        "sql",
        "insert-salesRecord.sql"
      );
      const insertScript = fs.readFileSync(filePath, "utf8");

      const itemsData = orders.map(({ plateSize, components }) => ({
        plateSize,
        components,
      }));

      const response = await database.query(insertScript, [
        saleDate,
        saleTime,
        totalPrice,
        employeeID,
        source,
        JSON.stringify(itemsData),
      ]);

      res.status(200).json({ message: "Sale recorded successfully" });
    } catch (error) {
      console.error("Error writing sales record:", error);
      res
        .status(500)
        .json({ message: "Error writing sales record", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
