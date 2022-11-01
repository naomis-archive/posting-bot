import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { logHandler } from "./logHandler";

/**
 * Validates that all environment variables are present.
 *
 * @returns {ExtendedClient["env"]} The bot's environment config.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (
    !process.env.DISCORD_TOKEN ||
    !process.env.DEBUG_HOOK ||
    !process.env.HOME_GUILD
  ) {
    logHandler.log("error", "Missing environment values!");
    process.exit(1);
  }

  return {
    homeGuild: process.env.HOME_GUILD,
    debugHook: new WebhookClient({ url: process.env.DEBUG_HOOK }),
    token: process.env.DISCORD_TOKEN,
  };
};
