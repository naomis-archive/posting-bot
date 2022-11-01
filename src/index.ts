import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  TextBasedChannel,
} from "discord.js";

import { ExtendedClient } from "./interfaces/ExtendedClient";
import { loadCommands } from "./utils/loadCommands";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  const bot = new Client({
    intents: [GatewayIntentBits.Guilds],
  }) as ExtendedClient;

  bot.env = validateEnv();
  // eslint-disable-next-line require-atomic-updates
  bot.commands = await loadCommands(bot);

  bot.on("ready", async () => {
    logHandler.log("debug", "Bot online!");
    await registerCommands(bot);
  });

  bot.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const target = bot.commands.find(
        (command) => command.data.name === interaction.commandName
      );

      if (!target) {
        await interaction.reply({
          content: "That command appears to be invalid.",
          ephemeral: true,
        });
        return;
      }

      await target.run(bot, interaction);
    }

    if (interaction.isModalSubmit()) {
      const { guild } = interaction;

      if (!guild) {
        await interaction.reply({
          ephemeral: true,
          content: "How did you get here without being in a server?",
        });
        return;
      }
      const [, channelId, roleId] = interaction.customId.split("-");
      const postTitle = interaction.fields.getTextInputValue("post-title");
      const postContent = interaction.fields.getTextInputValue("post-content");

      const channel = (guild.channels.cache.get(channelId) ||
        (await guild.channels.fetch(channelId))) as TextBasedChannel;

      const embed = new EmbedBuilder();
      embed.setTitle(postTitle);
      embed.setDescription(postContent);
      embed.setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      });
      embed.setFooter({
        text: "Built with love by Naomi - https://donate.naomi.lgbt",
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      const opts = roleId
        ? {
            content: `<@&${roleId}>`,
            embeds: [embed],
          }
        : {
            embeds: [embed],
          };

      await channel.send(opts);
      await interaction.reply({
        ephemeral: true,
        content: "I've posted that~!",
      });
    }
  });

  await bot.login(bot.env.token);
})();
