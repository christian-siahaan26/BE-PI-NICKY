import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

/**
 * Generates a JWT token with the user's name as payload.
 * @param name - The name of the user to store in the token.
 * @param id - The id of the user to store in the token.
 * @returns A signed JWT token.
 */
export const generateToken = (
  nidk: string,
  name: string,
  createdAt: String | Date
): string => {
  const isoDate = typeof createdAt === "string" ? createdAt : createdAt.toString();

  const payload = { nidk, name, createdAt: isoDate };
  const options = { expiresIn: 7200 };

  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = (
  token: string
): { nidk: string; name: string; createdAt: string } | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      nidk: string;
      name: string;
      createdAt: string;
    };
    return { ...decoded };
  } catch (err) {
    return null;
  }
};
