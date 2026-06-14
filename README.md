# github-activity-cli

A CLI tool to fetch and display a GitHub user's recent activity using the GitHub API. Built with Node.js and no external dependencies.

## Features

- Fetch recent public activity for any GitHub user
- Displays activity in a human-readable format with dates
- Filter activity by date range using `--since` and `--until` flags
- Graceful error handling for invalid usernames and network failures
- No external dependencies — uses Node.js built-ins only

## Requirements

- Node.js v14 or higher

## Installation

Clone the repository and link it globally:

```bash
git clone https://github.com/AvidStacker/github-activity-cli.git
cd github-activity-cli
npm link
```

## Usage

```bash
# Basic usage
github-activity <username>

# Filter by start date
github-activity <username> --since YYYY-MM-DD

# Filter by end date
github-activity <username> --until YYYY-MM-DD

# Filter by date range
github-activity <username> --since YYYY-MM-DD --until YYYY-MM-DD
```

## Examples

```bash
github-activity torvalds
github-activity torvalds --since 2026-01-01
github-activity torvalds --since 2026-01-01 --until 2026-06-01
```

### Example output

```
[14/06/2026] - Pushed to master in torvalds/linux
[14/06/2026] - Pushed to master in torvalds/linux
[12/06/2026] - Pushed to main in torvalds/GuitarPedal
[12/06/2026] - Starred torvalds/linux
[11/06/2026] - Opened an issue in torvalds/linux
```

## Supported Event Types

| Event | Output |
|-------|--------|
| PushEvent | Pushed to `<branch>` in `<repo>` |
| IssuesEvent | Opened/closed an issue in `<repo>` |
| WatchEvent | Starred `<repo>` |
| ForkEvent | Forked `<repo>` |
| CreateEvent | Created `<branch/tag/repo>` in `<repo>` |
| Other | Raw event type and repo name |

## Error Handling

```bash
# Invalid username
github-activity fakeuser123
# → Error: User "fakeuser123" not found.

# No activity in date range
github-activity torvalds --since 2030-01-01
# → No recent activity found.

# Network failure
# → Network error: <message>
```

## Project Background

Built as part of the [roadmap.sh GitHub User Activity](https://roadmap.sh/projects/github-user-activity) beginner project. The goal was to practice working with REST APIs, JSON parsing, CLI argument handling, and error handling in Node.js.

## License

ISC
