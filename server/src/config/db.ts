import { prisma } from "../lib/prisma"

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the database");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

connectDB();

export default prisma;