#!/usr/bin/env node

const https = require("https");

const username = process.argv[2];

if (!username) {
  console.error("Usage: github-activity <username>");
  process.exit(1);
}

const args = process.argv.slice(3);

let since = null;
let until = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--since" && args[i + 1]) {
    since = new Date(args[i + 1]);
  }
  if (args[i] === "--until" && args[i + 1]) {
    until = new Date(args[i + 1]);
  }
}

const options = {
  hostname: "api.github.com",
  path: `/users/${username}/events`,
  headers: {
    "User-Agent": "github-activity-cli",
  },
};

https.get(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    if (res.statusCode == 404) {
      console.error(`Error: User "${username}" not found.`);
      process.exit(1);
    }

    if (res.statusCode != 200) {
      console.error(`Error: GitHub API returned status ${res.statusCode}`);
      process.exit(1);
    }

    const events = JSON.parse(data);

    const filtered = events.filter((event) => {
      const createdAt = new Date(event.created_at);
      if (since && createdAt < since) return false;
      if (until && createdAt > until) return false;
      return true;
    });

    if (filtered.length === 0) {
      console.log("No recent activity found.");
      return;
    }

    filtered.forEach((event) => {
      const date = new Date(event.created_at).toLocaleDateString("en-GB");
      switch (event.type) {
        case "PushEvent":
          const branch = event.payload.ref.replace("refs/heads/", "");
          console.log(`[${date}] - Pushed to ${branch} in ${event.repo.name}`);
          break;
        case "IssuesEvent":
          console.log(`[${date}] - ${event.payload.action} an issue in ${event.repo.name}`);
          break;
        case "WatchEvent":
          console.log(`[${date}] - Starred ${event.repo.name}`);
          break;
        case "ForkEvent":
          console.log(`[${date}] - Forked ${event.repo.name}`);
          break;
        case "CreateEvent":
          console.log(`[${date}] - Created ${event.payload.ref_type} in ${event.repo.name}`);
          break;
        default:
          console.log(`[${date}] - ${event.type} in ${event.repo.name}`);
          break;
      }
    });
  });
}).on("error", (err) => {
  console.error(`Network error: ${err.message}`);
  process.exit(1);
});