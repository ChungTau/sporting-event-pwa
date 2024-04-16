import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient; // Removed `| undefined` to ensure TypeScript expects it to always be defined.
}

// Ensuring prisma is always initialized directly in the global scope or the module scope
if (process.env.NODE_ENV === "production") {
  global.prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}
const prisma = global.prisma; // This guarantees prisma is always defined.
  prisma.$executeRaw`CREATE DATABASE demo`;
  prisma.$use(async (params, next) => {
    if (params.action == "create" && params.model == "Account") {
      delete params.args.data["not-before-policy"]
    }
  
    const result = await next(params)
    // See results here
    return result
  })
  
  export default prisma;