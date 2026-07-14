# Reddit Media Browser

A personal, read-only Reddit media browser for Linux built with Node.js, Express, and plain HTML, CSS, and JavaScript.

## Purpose

The application allows an authenticated Reddit user to search for a Reddit username and browse that account's media posts in a gallery interface.

## Planned features

- Reddit OAuth authentication
- Search any Reddit username
- Image, gallery, GIF, and video support
- Sidebar grouped by subreddit
- Sort by date, score, or comment count
- Search post titles
- Filter by media type
- Fullscreen media viewer
- Local favorites
- Support for NSFW content that the authenticated account is permitted to access
- Links back to original Reddit posts

## Data usage

The application is intended for personal, non-commercial use.

It will:

- Use Reddit's official OAuth API
- Make read-only API requests
- Respect Reddit account permissions and content restrictions
- Respect API rate limits
- Avoid automated voting, posting, commenting, messaging, or moderation
- Avoid scraping Reddit pages outside the official API
- Avoid selling, redistributing, or using Reddit data for advertising
- Store favorites locally
- Keep OAuth secrets and tokens on the server

## Technology

- Node.js
- Express
- Express Session
- Plain HTML
- Plain CSS
- Plain browser JavaScript

## Local development

Install dependencies:

```bash
npm install
