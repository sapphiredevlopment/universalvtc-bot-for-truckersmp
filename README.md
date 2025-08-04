# Universal VTC Bot by Sapphire Development

A simple, open-source Discord bot template for any Virtual Trucking Company (VTC). Designed for easy setup by non-coders.

## Features
- Slash commands: `/ping`, `/info`, `/help`, `/player`, `/upcomingevents`
- Welcome messages for new members
- TruckersMP API integration
- Easy configuration via `config.json`
- Sapphire Development branding

## Quick Start
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Copy `.env.example` to `.env` and fill in:**
   - `DISCORD_TOKEN` — Your bot's token (keep this secret!)
   - `CLIENT_ID` — Your bot application's client ID
   - `GUILD_ID` — Your Discord server (guild) ID
3. **Edit `config.json`:**
   - Set all channel and role IDs (see comments in file)
   - Customize branding if desired
4. **(Optional) Edit `whitelist.json`:**
   - Add user IDs who should have special/staff access to restricted commands
5. **Start the bot:**
   ```bash
   node index.js
   ```

## File Explanations
- **config.json** — Main configuration for your server. See comments in the file for what each field does.
- **whitelist.json** — List of Discord user IDs who are allowed to use staff-only or restricted commands (e.g., announcing events).
- **.env** — Secret credentials (never share this file!).

## Example config.json (with comments)
```jsonc
{
  // Bot branding (shown in /info, /help, and embeds)
  "branding": "Universal VTC Bot by Sapphire Development",
  // The main/general chat channel ID
  "generalChannelId": "YOUR_GENERAL_CHANNEL_ID",
  // The rules/info channel ID
  "rulesChannelId": "YOUR_RULES_CHANNEL_ID",
  // Channel where event announcements are posted
  "eventsChannelId": "YOUR_EVENTS_CHANNEL_ID",
  // Channel for ticket system (support/help requests)
  "ticketsChannelId": "YOUR_TICKETS_CHANNEL_ID",
  // Role IDs to ping for events (list as many as you want)
  "eventPingRoles": [
    "ROLE_ID_1", // e.g., Event Notifications
    "ROLE_ID_2"  // e.g., Staff
  ],
  // Ticket categories (Discord category/channel IDs for tickets)
  "ticketCategories": {
    "support": "SUPPORT_CATEGORY_ID",
    "events": "EVENTS_CATEGORY_ID",
    "join": "JOIN_CATEGORY_ID"
  }
}
```

## Example whitelist.json
```json
{
  "whitelist": [
    "123456789012345678", // User ID of staff/admin
    "987654321098765432"  // Add more IDs as needed
  ]
}
```

---
**Need help?** Join Sapphire Development Discord Server or open an issue on GitHub!
