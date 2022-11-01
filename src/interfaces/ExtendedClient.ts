import { Client, WebhookClient } from "discord.js";

import { Command } from "./Command";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    debugHook: WebhookClient;
    homeGuild: string;
  };
  commands: Command[];
}
