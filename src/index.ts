import chalk from "chalk";
import { Command } from "commander";
import figlet from "figlet";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Schema } from "./schema";

async function main() {
  console.log(chalk.redBright(figlet.textSync("Subgraph To Puml")) + "\n");
  const program = new Command();

  program
    .version("0.1.0")
    .description(
      "A program to visualize GraphQL schema of The Graph Protocol Subgraph."
    )
    .option("-s, --schema <file>", "Open schema.graphql file")
    .parse(process.argv);

  const options = program.opts();

  if (options.schema) {
    const filePath = options.schema;
    const graphqlSourceCode = await readFile(filePath, { encoding: "utf-8" });
    const schema = new Schema(graphqlSourceCode);
    const pumlSourceCode = schema.print();

    const pumlPath = path.join(
      path.dirname(filePath),
      path.basename(filePath, ".graphql") + ".puml"
    );
    await writeFile(pumlPath, pumlSourceCode, { encoding: "utf-8" });

    console.log("Output file:", chalk.redBright(pumlPath));
  }

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  console.log(/* EMPTY STRING */);
}

main();
