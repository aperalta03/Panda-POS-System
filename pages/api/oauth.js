import { OAuth2Client } from 'google-auth-library';

//! TODO: Setup actual Database for Users

const findUserByEmail = async (email) => {
  console.log(`DEBUG: Looking for user with email: ${email}`);
  return null;
};

const createNewUser = async (email, name, picture) => {
  console.log(`DEBUG: Creating new user with email: ${email}, name: ${name}`);
  return { id: 'new-user-id', email, name, picture };
};

const validateEmailAndPassword = async (email, password) => {
  console.log(`DEBUG: Validating email/password for: ${email}`);
  if (email === 'test@example.com' && password === 'password123') {
    return { id: 'user-id', email, name: 'Test User' };
  }
  throw new Error('Invalid email or password');
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, token, email, password } = req.body;

  try {
    if (action === 'google') {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;
      return res.status(200).json({ id: 'google-user-id', email, name, picture });
    } else if (action === 'login' && email && password) {
      const user = await validateEmailAndPassword(email, password);
      return res.status(200).json(user);
    } else if (action === 'signup' && email && password) {
      const newUser = await createNewUser(email, 'New User', null);
      return res.status(201).json(newUser);
    } else {
      console.log('DEBUG: Invalid request received');
      return res.status(400).json({ error: 'Invalid request' });
    }
  } catch (error) {
    console.error('DEBUG: Authentication error:', error);
    return res.status(400).json({ error: error.message });
  }
}