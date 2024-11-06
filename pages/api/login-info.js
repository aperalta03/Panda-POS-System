import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'employee-info.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');

            const result = await database.query(queryText);

            const employeeData = result.rows.map((employee) => ({
                employeeID: employee.employee_id, 
                name: `${employee.first_name} ${employee.last_name}`, 
                isManager: employee.is_manager   
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