import { OAuth2Client } from 'google-auth-library';
import database from '../../utils/database';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * 
 * @author Alonso Peralta Espinoza
 * 
 * Handles various authentication actions such as login, signup, email verification, and password reset.
 * @module api/oauth
 * @api {post} /api/oauth
 * @apiName Auth
 * @apiGroup Authentication
 *
 * @apiParam {String} action Specifies the authentication action: 'google', 'login', 'signup', 'verify-email', 'forgot-password', or 'reset-password'.
 * @apiParam {String} [token] Token for email verification or password reset.
 * @apiParam {String} [email] User's email address.
 * @apiParam {String} [password] User's password (for login, signup, or reset-password).
 * @apiParam {String} [employee_id] Employee ID (required for signup).
 *
 * @apiSuccess {Object} Response object with a success message or user information.
 * 
 * @apiError (400) {Object} Response object with an error message for invalid actions or missing parameters.
 * @apiError (401) {Object} Response object for invalid credentials.
 * @apiError (404) {Object} Response object when a user is not found.
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage for Google login:
 *   curl -X POST \
 *     http://localhost:3000/api/auth \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "action": "google",
 *           "token": "GOOGLE_ID_TOKEN"
 *         }'
 *
 * @apiExample {curl} Example usage for email/password login:
 *   curl -X POST \
 *     http://localhost:3000/api/auth \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "action": "login",
 *           "email": "user@example.com",
 *           "password": "password123"
 *         }'
 *
 * @apiExample {curl} Example usage for signup:
 *   curl -X POST \
 *     http://localhost:3000/api/auth \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "action": "signup",
 *           "employee_id": 123,
 *           "email": "newuser@example.com",
 *           "password": "password123"
 *         }'
 *
 * @apiSuccessExample {json} Success response for email verification:
 *     {
 *       "message": "Email verified successfully."
 *     }
 *
 * @apiErrorExample {json} Error response for invalid credentials:
 *     {
 *       "error": "Invalid email or password"
 *     }
 *
 * @apiErrorExample {json} Error response for missing parameters:
 *     {
 *       "error": "Invalid action"
 *     }
 *
 * @apiErrorExample {json} Error response for server issues:
 *     {
 *       "error": "Internal server error"
 *     }
 */

//** Helper Functions **//
const generateToken = () => crypto.randomBytes(32).toString('hex');

const hashPassword = async (password) => {
  const saltRounds = 10; // Adjust as needed; higher rounds increase security but slow hashing
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const saveVerificationToken = async (email, token) => {
  try {
    await database.query(
      `INSERT INTO email_verification (email, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 day')
       ON CONFLICT (email) DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '1 day'`,
      [email, token]
    );
  } catch (error) {
    console.error('Error saving verification token:', error);
    throw new Error('Database error');
  }
};

//** Send Email **//
const sendEmail = async (email, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
    html, 
  });
};

//** Find User By Email **//
const findUserByEmail = async (email) => {
  try {
    const result = await database.query('SELECT * FROM employee_login WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database error');
  }
};

//** Create New User **//
const createNewUser = async (employee_id, email, password) => {
  try {
    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);

    const result = await database.query(
      'INSERT INTO employee_login (employee_id, email, password, verified) VALUES ($1, $2, $3, false) RETURNING *',
      [employee_id, email, hashedPassword]
    );

    console.log("User inserted into database:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error during user creation:", error.message, error.stack);
    throw new Error('Database error while creating user');
  }
};

//** Login Function **//
const validateEmailAndPassword = async (email, password) => {
  // Check if the email exists
  const emailResult = await database.query('SELECT * FROM employee_login WHERE email = $1', [email]);
  if (emailResult.rows.length === 0) {
    return { error: 'Account does not exist' };
  }

  const user = emailResult.rows[0];

  // Compare the hashed password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password' };
  }

  // Check if the account is verified
  if (!user.verified) {
    return { error: 'Account not verified. Please verify your email.' };
  }

  return user;
};

//** Main Handler **//
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  const { action, token, email, password, employee_id } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    //** Google LogIn Button **//
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
    }

    //** E/P LogIn **//
    if (action === 'login') {
      const user = await validateEmailAndPassword(email, password);

      if (user.error === 'Account does not exist') {
        return res.status(404).json({ error: user.error });
      }

      if (user.error === 'Invalid password') {
        return res.status(401).json({ error: user.error });
      }

      return res.status(200).json(user);
    }


    //** E/P SignUp **//
    if (action === 'signup' && employee_id && email && password) {
      try {
        console.log("Signup initiated with:", { employee_id, email, password });

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          console.log("Signup Error: User already exists");
          return res.status(400).json({ error: 'User already exists' });
        }

        // Log before creating user
        console.log("Creating new user...");
        const newUser = await createNewUser(employee_id, email, password);
        console.log("New user created successfully:", newUser);

        // Generate a verification token and send an email
        console.log("Generating verification token...");
        const verificationToken = generateToken();
        console.log("Saving verification token...");
        await saveVerificationToken(email, verificationToken);

        const verificationLink = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
        const emailHTML = `
          <p>Click the button below to verify your email:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: green; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${verificationLink}</p>
        `;

        console.log("Sending verification email...");
        await sendEmail(
          email,
          'Verify Your Email',
          `Click this link to verify your email: ${verificationLink}`,
          emailHTML
        );

        console.log("Signup completed successfully.");
        return res.status(201).json({ message: 'Verification email sent. Please verify your email to complete signup.' });
      } catch (error) {
        console.error("Signup Error:", error.message, error.stack);
        return res.status(500).json({ error: 'Internal server error during signup.' });
      }
    }

    //** Verify Email **//
    if (action === 'verify-email') {
      try {
        // Check if the verification token is valid and not expired
        const result = await database.query(
          'SELECT email FROM email_verification WHERE token = $1 AND expires_at > NOW()',
          [token]
        );

        if (result.rows.length === 0) {
          return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const verifiedEmail = result.rows[0].email;

        // Mark the email as verified
        await database.query('UPDATE employee_login SET verified = true WHERE email = $1', [verifiedEmail]);

        // Remove the verification token
        await database.query('DELETE FROM email_verification WHERE email = $1', [verifiedEmail]);

        return res.status(200).json({ message: 'Email verified successfully.' });
      } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    //** Forgot Password **//
    if (action === 'forgot-password') {
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const resetToken = generateToken();
      await saveVerificationToken(email, resetToken);

      const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
      const emailHTML = `
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: red; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
      `;

      await sendEmail(
        email,
        'Reset Your Password',
        `Click this link to reset your password: ${resetLink}`,
        emailHTML
      );

      return res.status(200).json({ message: 'Password reset email sent.' });
    }

    //** Reset Password **//
    if (action === 'reset-password') {
      try {
        // Query to validate the token
        const result = await database.query(
          'SELECT email FROM email_verification WHERE token = $1 AND expires_at > NOW()',
          [token]
        );

        if (result.rows.length === 0) {
          return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const resetEmail = result.rows[0].email;

        // Update the password
        await database.query('UPDATE employee_login SET password = $1 WHERE email = $2', [password, resetEmail]);
        await database.query('DELETE FROM email_verification WHERE email = $1', [resetEmail]);

        console.log('DEBUG: Password reset successfully for email:', resetEmail);

        return res.status(200).json({ message: 'Password reset successfully.' });
      } catch (error) {
        console.error('DEBUG: Reset password error:', error.message);
        return res.status(500).json({ error: 'Internal server error during password reset.' });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}