# ClearStatus

ClearStatus is a modern status page solution built with Next.js that allows you to deploy customizable status pages for your projects and services. Similar to platforms like Instatus, Atlassian Statuspage, or statuspage.io, ClearStatus provides an easy way to communicate service availability and incidents to your users.

## Features

- **Built with Next.js**: Leverages the power of Next.js for fast, modern web applications
- **Self-hostable**: Deploy your own status page with full control
- **Customizable**: Tailor the status page to match your brand and needs
- **Status Page Management**: Create and manage status pages similar to commercial solutions like Instatus or Atlassian Statuspage

## Getting Started

### Deploy with docker

```bash
git clone https://github.com/satindar31/clearstatus
cd clearstatus
cp .env.example .env
nano .env
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
