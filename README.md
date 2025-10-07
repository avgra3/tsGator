# Gator

This is a simple RSS aggregator allowing a user or users to add new feeds, search for new posts and add them, see all links for the posts which they can checkout the url if they are interested in the title.

A user can also unfollow a feed and also see all available feeds.

## Setup

- npm version `22.15.0`
- Postgres database with a database named `gator`
- Gator relies on a config file located at `~/.gatorconfig.json` and it should look like the below.

```json:
{
  "db_url": "connection_string_goes_here",
  "current_user_name": "username_goes_here"
}
```

Once you have the above, run `npm install` to install dependencies. If you want to use this in a development environment, run `npm install -D`.

Then, run the following to ensure you have all the necessary tables setup:

```bash
# May not need if you have all the necessary migration files
npm run generate

# Actually makes the table schemas in the database.
npm run migrate
```

If the migration steps fail, ensure your connection string is correct for Postgres.

## Usage

From the root directory run:

```bash
# See a list of available commands
npm run start help

# Add a new user (will automatically log you in as that user)
npm run start register NewUserName

# Reset user's table. Should only be used in development.
npm run start reset

# See all users
npm run start users

# Runs fetch to get and update feeds. Takes a string for how long between intervals
npm run start agg "10s"

# Add a new feed. Takes the RSS url as an argument.
npm run start addfeed "<FEED_URL>"

# Have the current user follow a feed. Automatically done for the user who added the feed.
npm run start follow "<FEED_URL>"

# See which feeds you are following. Does not have to be one you created.
npm run start following

# Unfollow a feed. Input the url.
npm run start unfollow "<FEED_URL>"

# Browse all posts for feeds you follow. Takes optional argument of limit. Defaults to 2.
npm run start browse "<LIMIT>"
```
