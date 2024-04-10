declare global {
    var prisma: PrismaClient; // This must be a `var` and not a `let / const`
  }
  
  import { PrismaClient } from "@prisma/client";
  let prisma: PrismaClient;
  
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }

  prisma.$use(async (params, next) => {
    if (params.action == "create" && params.model == "Account") {
      delete params.args.data["not-before-policy"]
    }
  
    const result = await next(params)
    // See results here
    return result
  })
  
  export default prisma;