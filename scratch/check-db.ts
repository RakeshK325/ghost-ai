import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const projects = await prisma.project.findMany({
    include: {
      collaborators: true,
    }
  });
  console.log("Projects in DB:");
  console.log(JSON.stringify(projects, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
