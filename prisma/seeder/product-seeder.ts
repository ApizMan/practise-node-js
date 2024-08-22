// seed.ts

import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    // Seed Users
    await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashSync('password', 10),
            role: 'ADMIN',
        },
    });

    await prisma.user.create({
        data: {
            name: 'Regular User',
            email: 'user@example.com',
            password: hashSync('password', 10),
            role: 'USER',
        },
    });

    // Seed 50 Products
    for (let i = 1; i <= 50; i++) {
        await prisma.product.create({
            data: {
                name: `Product ${i}`,
                description: `This is the description for Product ${i}`,
                price: (Math.random() * 100).toFixed(2), // Random price between 0 and 100
                tags: 'electronics, gadgets', // Same tags for all, you can customize this
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
