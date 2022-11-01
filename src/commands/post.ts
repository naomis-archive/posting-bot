import {
  ActionRowBuilder,
  GuildMember,
  ModalBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { Command } from "../interfaces/Command";

export const post: Command = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Creates a post.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to post in.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("ping").setDescription("The role to ping, if desired.")
    ),
  run: async (bot, interaction) => {
    const { guild, member } = interaction;

    if (!guild || !member) {
      await interaction.reply({
        content: "You must run this command in a server.",
        ephemeral: true,
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    ) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const postChannel = interaction.options.getChannel("channel", true);

    if (!postChannel || !("send" in postChannel)) {
      await interaction.reply({
        content:
          "I can only post in text channels. Make sure you provide a valid channel.",
        ephemeral: true,
      });
      return;
    }

    const pingRole = interaction.options.getRole("ping");

    const postComponent = new TextInputBuilder()
      .setCustomId("post-content")
      .setLabel("What would you like to post?")
      .setRequired(true)
      .setMaxLength(4000)
      .setStyle(TextInputStyle.Paragraph);
    const postRow = new ActionRowBuilder<TextInputBuilder>().setComponents([
      postComponent,
    ]);
    const titleComponent = new TextInputBuilder()
      .setCustomId("post-content")
      .setLabel("What is the title of your post?")
      .setRequired(true)
      .setMaxLength(256)
      .setStyle(TextInputStyle.Paragraph);
    const titleRow = new ActionRowBuilder<TextInputBuilder>().setComponents([
      titleComponent,
    ]);

    const modal = new ModalBuilder()
      .setCustomId(
        pingRole
          ? `post-${postChannel.id}-${pingRole.id}`
          : `post-${postChannel.id}`
      )
      .setTitle("Make a post!")
      .addComponents([titleRow, postRow]);

    await interaction.showModal(modal);
  },
};
