import { eq } from "drizzle-orm";
import { db } from "./client";
import { staff } from "./schema/staff";
import { hashPassword } from "../utils/auth";
import { logger } from "../config/logger";

async function seedAdmin() {
  const email = "admin@campusfix.edu";
  const password = "Admin@123";
  const name = "Super Admin";

  try {
    // Check if admin already exists
    const existing = await db
      .select({ id: staff.id })
      .from(staff)
      .where(eq(staff.email, email))
      .limit(1);

    if (existing.length > 0) {
      logger.info(`✅ Admin already exists with email: ${email}`);
      process.exit(0);
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Insert admin
    await db.insert(staff).values({
      name,
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    logger.info("✅ Admin seeded successfully");
    logger.info(`   Email:    ${email}`);
    logger.info(`   Password: ${password}`);
    logger.info(`   Role:     admin`);
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "❌ Failed to seed admin");
    process.exit(1);
  }
}

seedAdmin();