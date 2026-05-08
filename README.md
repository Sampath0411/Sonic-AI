# Sonic AI

A modern AI-powered chat application with real-time responses, authentication, and a sleek UI.

## Features
- **Real-time AI Chat** - Powered by OpenAI's GPT models via OpenRouter
- **User Authentication** - Secure sign-up/sign-in with email/password
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Animated UI** - Smooth transitions with Framer Motion
- **Client-Side Routing** - Fast navigation with TanStack Router
- **Chat History** - Persistent conversations stored in Supabase
- **Loading States** - Visual feedback during AI responses

## Tech Stack
<div align="center">
  <a href="https://vitejs.dev" target="_blank">
    <img src="https://img.shields.io/badge/Vite-623CE4?style=flat-square&logo=vite&logoColor=white" />
  </a>
  <a href="https://reactjs.org" target="_blank">
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  </a>
  <a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  </a>
  <a href="https://tailwindcss.com" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  </a>
  <a href="https://supabase.com" target="_blank">
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  </a>
  <a href="https://tanstack.com/router" target="_blank">
    <img src="https://img.shields.io/badge/TanStack%20Router-000?style=flat-square&logo=tanstack&logoColor=white" />
  </a>
</div>

<div align="center" style="margin-top: 10px;">
  <a href="https://framer.com" target="_blank">
    <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white" />
  </a>
  <a href="https://lucide.dev" target="_blank">
    <img src="https://img.shields.io/badge/Lucide-2496ED?style=flat-square&logo=lucide&logoColor=white" />
  </a>
  <a href="https://vercel.com" target="_blank">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
  </a>
</div>

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Vercel account (for deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sampath0411/Sonic-AI.git
   cd Sonic-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see [Environment Variables](#environment-variables))
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Environment Variables for Vercel
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Add the following environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key
   - `OPENAI_API_KEY` - Your OpenRouter API key (get it from https://openrouter.ai)

## Project Structure
```
Sonic-AI/
├── src/
│   ├── assets/          # Static assets (logo, icons)
│   ├── components/      # Reusable React components
│   ├── integrations/    # Third-party service integrations
│   ├── lib/            # Utility functions and helpers
│   ├── routes/         # TanStack Router route definitions
│   ├── styles.css      # Global CSS styles
│   ├── main.tsx        # Application entry point
│   └── vite.config.ts  # Vite configuration
├── api/                # Vercel serverless functions
├── dist/               # Production build output
├── README.md           # This file
└── package.json        # Project dependencies and scripts
```

## Deployment
### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Cloudflare Workers (Alternative)
```bash
npm run publish
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Sampath0411">Sampath Satya Saran</a></p>
</div>