import bcrypt from "bcrypt"
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing records (optional)
  await prisma.user.deleteMany();
  await prisma.task.deleteMany();

  const adminUserPass = "password";
  const hashedPassword = await bcrypt.hash(adminUserPass, 10);
	//@ts-ignore
  const userData: User = {
    email: "admin@email.com",
    name: "Admin",
    password: hashedPassword,
  };

  const user = await prisma.user.create({
    data: userData,
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
				userId: user.id,
        title: "Buy groceries",
        color: "green",
        completed: false,
      },
      {
				userId: user.id,
        title: "Complete assignment",
        color: "yellow",
        completed: false,
      },
      {
				userId: user.id,
        title: "Review pull request",
        color: "blue",
        completed: true,
      },
    ],
  });

  console.log("Database has been seeded. 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
