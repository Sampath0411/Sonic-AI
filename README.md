# Sonic AI

<div align="center">
  <img src="src/assets/sonic-logo.png" alt="Sonic AI Logo" width="120" height="120" />
  
  <h2>A Modern AI-Powered Chat Platform</h2>
  
  <p>
    Experience real-time AI conversations with Sonic AI - a sleek, responsive chat application powered by OpenAI's GPT models.
  </p>
  
  <p align="center">
    <a href="#demo">Demo</a>
    •
    <a href="#features">Features</a>
    •
    <a href="#tech-stack">Tech Stack</a>
    •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

<div align="center">
  <a href="https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=sonic-ai">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" width="180" />
  </a>
</div>

---

## Demo

![Sonic AI Screenshot](https://via.placeholder.com/1200x600?text=Sonic+AI+Screenshot)

*(Add actual screenshots here)*

---

## Features

### 🚀 Core Functionality
- **Real-time AI Chat** - Powered by OpenAI's GPT-3.5
- **User Authentication** - Secure sign-in with email/password
- **Responsive Design** - Works seamlessly on all devices
- **Animated UI** - Smooth transitions with Framer Motion
- **Client-Side Routing** - Fast navigation with TanStack Router

### 🎨 UI/UX
- **Dark Theme** - Easy on the eyes
- **Sidebar Navigation** - Quick access to chats
- **Message History** - Persistent chat sessions
- **Loading States** - Visual feedback during AI responses

### 🔒 Security
- **Environment Variables** - Secure API key management
- **Supabase Auth** - Industry-standard authentication
- **CORS Protection** - Secure API endpoints

---

## Tech Stack

<div align="center">
  <a href="https://vitejs.dev" target="_blank">
    <img src="https://img.shields.io/badge/Vite-623CE4?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="https://reactjs.org" target="_blank">
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://supabase.com" target="_blank">
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://tanstack.com/router" target="_blank">
    <img src="https://img.shields.io/badge/TanStack%20Router-000?style=flat-square&logo=tanstack&logoColor=white" alt="TanStack Router" />
  </a>
</div>

<div align="center" style="margin-top: 10px;">
  <a href="https://framer.com" target="_blank">
    <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  </a>
  <a href="https://lucide.dev" target="_blank">
    <img src="https://img.shields.io/badge/Lucide-2496ED?style=flat-square&logo=lucide&logoColor=white" alt="Lucide" />
  </a>
  <a href="https://vercel.com" target="_blank">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  </a>
</div>

---

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

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# OpenAI API Key (for production)
OPENAI_API_KEY=your_openai_api_key
```

### Environment Variables for Vercel

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Add the following environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `OPENAI_API_KEY`

---

## Project Structure

```
Sonic-AI/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # React components
│   ├── integrations/    # Third-party integrations
│   ├── lib/            # Utility libraries
│   ├── routes/         # TanStack Router routes
│   ├── styles.css      # Global styles
│   ├── main.tsx        # App entry point
│   └── vite.config.ts  # Vite configuration
├── public/             # Public assets
├── api/                # Vercel serverless functions
├── dist/               # Build output
├── README.md           # This file
└── package.json        # Dependencies
```

---

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

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [OpenAI](https://openai.com) for the powerful GPT models
- [Supabase](https://supabase.com) for the excellent authentication service
- [Vercel](https://vercel.com) for seamless deployment
- [TanStack](https://tanstack.com) for the amazing routing library

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Sampath0411">Sampath Satya Saran</a></p>
</div>