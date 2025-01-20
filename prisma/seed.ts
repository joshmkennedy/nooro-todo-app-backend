import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing records (optional)
  await prisma.task.deleteMany();

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Buy groceries',
        color: 'green',
        completed: false,
      },
      {
        title: 'Complete assignment',
        color: 'yellow',
        completed: false,
      },
      {
        title: 'Review pull request',
        color: 'blue',
        completed: true,
      },
    ],
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
