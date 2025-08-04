import { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

// Register guild commands automatically
import { REST, Routes } from 'discord.js';
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('Registering guild slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('Guild slash commands registered.');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  const statusMessage = config.statusMessage || 'A Sapphire Development Project';
  client.user.setActivity(statusMessage, { type: 'PLAYING' });
});

// Slash command interaction handler
client.on('interactionCreate', async interaction => {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
    return;
  }
  // Handle ticket dropdown (select menu)
  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
    const { handleTicketSelect } = await import('./commands/setup_tickets.js');
    await handleTicketSelect(interaction);
    return;
  }
  // Handle ticket close button
  if (interaction.isButton() && interaction.customId === 'close_ticket') {
    const { handleTicketButton } = await import('./commands/setup_tickets.js');
    await handleTicketButton(interaction);
    return;
  }
});

// Welcome embed on member join
client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.cache.get(config.generalChannelId);
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setColor('#7f5af0')
    .setTitle('🎉 Welcome to Essex Haulage VTC 🚛')
    .setDescription(`Hey ${member}, welcome to Essex Haulage VTC 🚛! We're thrilled to have you in our Discord`)
    .addFields(
      { name: '📌 Getting Started:', value: `🔹 Read <#${config.rulesChannelId}> to ensure a smooth experience.\n🔹 Check out <#${config.eventsChannelId}> for upcoming convoys.` },
      { name: '💡 Need Help?', value: `If you have any questions, feel free to ask in <#${config.ticketsChannelId}> or ping our staff.` }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
  channel.send({ embeds: [embed] });
});

client.login(process.env.DISCORD_TOKEN);
