# Sonic AI

<div align="center">
  <img src="src/assets/sonic-logo.png" alt="Sonic AI Logo" width="120" height="120" />
  <h2>A Modern AI-Powered Chat Platform</h2>
  <p>
    Experience real-time AI conversations with Sonic AI — a sleek, responsive chat application powered by OpenAI's GPT models via OpenRouter.
  </p>
</div>

---

## Features

### Core Functionality
- **Real-time AI Chat** — Powered by OpenAI's GPT models via OpenRouter
- **User Authentication** — Secure sign-up/sign-in with email & password (Supabase)
- **Responsive Design** — Works seamlessly on desktop and mobile devices
- **Animated UI** — Smooth transitions and micro-interactions with Framer Motion
- **Client-Side Routing** — Fast navigation with TanStack Router
- **Persistent Chat History** — Conversations stored in Supabase database
- **Streaming Responses** — AI replies stream in real-time as they're generated
- **Chat Management** — Create, search, and delete chat conversations
- **Tone & Length Settings** — Customize AI response style in settings

### UI/UX Highlights
- **Dark Theme** — Easy on the eyes with carefully crafted color palette
- **Sidebar Navigation** — Quick access to all chats with collapse/expand
- **Message History** — Full conversation threads with user and AI messages
- **Loading States** — Visual feedback during AI response generation
- **Toast Notifications** — Elegant error/success messaging via Sonner

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
  <a href="https://www.framer.com/motion/" target="_blank">
    <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  </a>
  <a href="https://lucide.dev" target="_blank">
    <img src="https://img.shields.io/badge/Lucide-2496ED?style=flat-square&logo=lucide&logoColor=white" alt="Lucide Icons" />
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
- Supabase account (for authentication & database)
- OpenRouter account (for AI API access)
- Vercel account (for deployment)

### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sampath0411/Sonic-AI.git
   cd Sonic-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

### Environment Variables for Production (Vercel)
Add these in your Vercel Dashboard → Settings → Environment Variables:
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |
| `OPENAI_API_KEY` | Your OpenRouter API key |

---

## Project Structure
```
Sonic-AI/
├── src/
│   ├── assets/              # Static assets (Sonic logo, icons)
│   ├── components/          # Reusable React components (UI library)
│   │   └── ui/              # Shadcn-style UI components
│   ├── integrations/        # Third-party service integrations
│   │   └── supabase/        # Supabase client & types
│   ├── lib/                # Utility functions and helpers
│   ├── routes/              # TanStack Router route definitions
│   │   ├── __root.tsx        # Root layout with providers
│   │   ├── index.tsx         # Home page
│   │   ├── auth.tsx          # Authentication page
│   │   ├── chat.tsx          # Main chat interface
│   │   └── settings.tsx      # User settings page
│   ├── styles.css          # Global CSS styles
│   ├── main.tsx            # Application entry point
│   └── vite.config.ts     # Vite configuration
├── api/                      # Vercel serverless functions
│   └── chat.ts              # AI chat API endpoint
├── dist/                     # Production build output
├── README.md                 # This file
├── package.json               # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add the environment variables listed above in Vercel Dashboard
4. Deploy — Vercel will automatically build and deploy on every push

### Deploy to Cloudflare Workers (Alternative)
```bash
npm run publish
```

---

## Key Features in Detail

### 🤖 AI Chat
- Real-time streaming responses powered by OpenAI GPT models
- Customizable response tone (friendly, professional, concise, etc.)
- Adjustable response length (short, medium, long)
- Search integration for up-to-date information

### 💬 Chat Management
- Create new chat conversations
- Search through chat history
- Delete unwanted conversations
- Sidebar with collapsible chat list

### 👤 User Features
- Email/password authentication via Supabase
- User profile with display name and avatar
- Settings page to customize AI behavior
- Secure session management

### 🎨 UI/UX
- Built with Radix UI primitives for accessibility
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Lucide React for consistent iconography
- Sonner for elegant toast notifications
- Dark theme optimized for long sessions

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Sampath0411">Sampath Satya Saran</a></p>
  <p>
    <a href="https://www.instagram.com/sam.verse_56">@sam.verse_56</a> •
    <a href="https://www.instagram.com/_exotic_sampath.56">@_exotic_sampath.56</a> •
    <a href="https://www.instagram.com/samxeditz.56">@samxeditz.56</a>
  </p>
</div>
