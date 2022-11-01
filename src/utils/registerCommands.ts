import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";
import { logHandler } from "./logHandler";

/**
 * Registers the commands for the bot.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {boolean} True on successful registration.
 */
export const registerCommands = async (
  bot: ExtendedClient
): Promise<boolean> => {
  try {
    if (!bot.user?.id) {
      logHandler.log("error", "Bot is not authenticated.");
      return false;
    }
    const rest = new REST({ version: "9" }).setToken(bot.env.token);
    const commandData = bot.commands.map((command) => command.data.toJSON());

    if (!commandData.length) {
      logHandler.log("error", "No commands found to register.");
      return false;
    }
    await rest.put(
      Routes.applicationGuildCommands(bot.user.id, bot.env.homeGuild),
      {
        body: commandData,
      }
    );
    return true;
  } catch (err) {
    await errorHandler(bot, "register commands", err);
    return false;
  }
};
