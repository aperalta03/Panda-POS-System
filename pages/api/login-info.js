import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'employee-info.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');

            const result = await database.query(queryText);

            // Transform the data to match the expected format for the front-end
            const employeeData = result.rows.map((employee) => ({
                employeeID: employee.employee_id,  // Renaming to match front-end code
                name: `${employee.first_name} ${employee.last_name}`,  // Combining first and last name
                isManager: employee.is_manager     // Mapping to the correct field
            }));

            // Return the transformed data
            res.status(200).json({ data: employeeData });
        } catch (error) {
            console.error('Error fetching Employee info:', error);
            res.status(500).json({ error: 'Error fetching Employee info' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}