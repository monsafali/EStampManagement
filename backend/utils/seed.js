import UserAuth from "../models/UserAuth.model.js";

export const seedSuperAdmin = async () => {
  try {
    const exists = await UserAuth.findOne({ role: "super-admin" });

    if (exists) {
      console.log("Super Admin already exists.");
      return;
    }

    await UserAuth.create({
      fullname: process.env.SUPER_ADMIN_NAME,
      username: process.env.SUPER_ADMIN_USERNAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "super-admin",
      image: "",
      sessionVersion: 0,
      singleDeviceEnforced: false,
    });

    console.log("Super Admin created successfully.");
  } catch (error) {
    console.error("Super-admin seeding failed:", error);
  }
};
