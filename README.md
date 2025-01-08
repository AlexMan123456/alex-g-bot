# AlexGBot Project

This is a Discord bot created by AlexMan123456 using the [sapphire framework][sapphire] written in Javascript.

## How to use it?

### Cloning the repository

Firstly, clone the repository into your local directory using the following command:

```sh
git clone https://github.com/AlexMan123456/alex-g-bot
```

Now set your terminal to the Git repository by typing this into your terminal:

```sh
cd alex-g-bot
```

### Installing all dependencies

Install all dependencies using the following command:

```sh
npm install
```

### Setting up a Prisma database

To create a Prisma database for the bot, follow the instructions at https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-postgresql

### Initialising the environment variables

Create a new file called .env.development. This file should contain the following properties (without brackets):

```
DISCORD_TOKEN="(your token here)"
PREFIX="!"
OWNER_ID="(your Discord ID here)"
GUILD_IDS="(your first Guild ID here),(your second Guild ID here)"
```

Now in the provided .env file (which would automatically be given after following the instructions for setting up a Prisma database), add the following property:

`DATABASE_URL="(your database URL here)"``

This should be a link to your Prisma database. It's in a separate .env file because I can't seem to make it recognise my .env.development file for some reason.

### Development

To run the bot in a development environment, use the following command:

```sh
npm run dev
```
