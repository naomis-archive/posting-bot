import { readdir } from "fs/promises";
import { join } from "path";

import { Command } from "../interfaces/Command";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Reads the `/commands` directory and dynamically imports the files,
 * then pushes the imported data to an array. Mounts the array to the bot,
 * returns success status.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {boolean} If commands were loaded and mounted.
 */
export const loadCommands = async (bot: ExtendedClient): Promise<boolean> => {
  try {
    const result: Command[] = [];
    const files = await readdir(
      join(process.cwd(), "prod", "commands"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd(), "prod", "commands", file));
      result.push(mod[name] as Command);
    }
    bot.commands = result;
    return true;
  } catch (err) {
    await errorHandler(bot, "slash command loader", err);
    return false;
  }
};
