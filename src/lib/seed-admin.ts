import { Admin } from "@/models/Admin";

let isSeeded = false;

export async function seedAdminUser() {
  // Only run once per application lifecycle
  if (isSeeded) return;

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn(
        "⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables"
      );
      return;
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ Admin user already exists:", adminEmail);
      isSeeded = true;
      return;
    }

    // Create new admin
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully:", adminEmail);
    console.log("🔐 You can now login at /admin/login");
    isSeeded = true;
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
}
