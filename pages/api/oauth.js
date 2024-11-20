import { OAuth2Client } from 'google-auth-library';
import database from '../../utils/database';

// Sign Up Check
const findUserByEmail = async (email) => {
  try {
    const result = await database.query('SELECT * FROM employee_login WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database error');
  }
};

// Full Sign Up
const createNewUser = async (employee_id, email, password) => {
  try {
    const result = await database.query(
      'INSERT INTO employee_login (employee_id, email, password) VALUES ($1, $2, $3) RETURNING *',
      [employee_id, email, password]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating new user:', error);
    throw new Error('Database error');
  }
};

// Log in Check
const validateEmailAndPassword = async (email, password) => {
  try {
    const result = await database.query('SELECT * FROM employee_login WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    throw new Error('Invalid email or password');
  } catch (error) {
    console.error('Error validating email and password:', error);
    throw new Error('Database error');
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, token, email, password, employee_id } = req.body;

  try {
    if (action === 'google') {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;

      const user = await findUserByEmail(email);
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(403).json({ error: 'Google signup is not allowed' });
      }

    } else if (action === 'login' && email && password) {
      const user = await validateEmailAndPassword(email, password);
      return res.status(200).json(user);

    } else if (action === 'signup' && employee_id && email && password) {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const newUser = await createNewUser(employee_id, email, password);
      return res.status(201).json(newUser);
      
    } else {
      console.log('Invalid request received');
      return res.status(400).json({ error: 'Invalid request' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(400).json({ error: error.message });
  }
}