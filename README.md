# Guðjón Kristjánsson - Personal Website

A personal website with an AI-powered chatbot that can answer questions about Guðjón based on his resume and background information.

## Features

- Modern, responsive design with Tailwind CSS
- About page with Markdown content
- Projects showcase
- AI-powered chatbot that answers questions about Guðjón
- Serverless functions for OpenAI API integration

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Netlify Functions
- OpenAI API

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Start the Netlify development server (with serverless functions)
npm run netlify:dev
```

## Deployment

This project is set up to be deployed directly to Netlify using the Netlify CLI.

```bash
# Deploy to Netlify
npm run deploy
```

### Environment Variables

You need to set the following environment variable in your Netlify dashboard:

- `OPENAI_API_KEY`: Your OpenAI API key

## Netlify Integration

To set up your site on Netlify:

1. Install the Netlify CLI globally (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify site:
   ```bash
   netlify init
   ```

4. Deploy your site:
   ```bash
   npm run deploy
   ```

5. Set up environment variables in the Netlify dashboard