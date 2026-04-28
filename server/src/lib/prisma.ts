import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = `${process.env.DB_URL}`;

const pool = new Pool({connectionString:connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };