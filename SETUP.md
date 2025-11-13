# Mina - AI Voice Assistant Setup Guide

A Telegram-style voice AI assistant built with Next.js, OpenAI, GSAP, and Tailwind CSS.

## 🎯 Features

### ✨ UI/UX
- **Telegram-like Interface**: 3-column layout (chat list, messages, settings)
- **Fully Responsive**: Mobile, tablet, and desktop optimized
- **GSAP Animations**: Smooth entrance animations and transitions
- **Dark Theme**: Beautiful dark gradient design with glassmorphism

### 🤖 AI Features
- **OpenAI Integration**: GPT-4 for conversations
- **Voice Input**: Speech-to-text using Whisper AI
- **Voice Output**: Text-to-speech for assistant responses
- **Multiple Assistants**: 5 unique AI personalities
- **Customizable Settings**: Configure voice style, topic, and instructions per chat

### 🔐 Authentication
- Login page with social authentication UI
- Protected routes
- Session management
- User profile display

## 📋 Prerequisites

1. **Node.js** (v18 or later)
2. **OpenAI API Key** - Get one at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 🚀 Installation

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure OpenAI API Key

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your OpenAI API key:

\`\`\`
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
\`\`\`

⚠️ **Important**: Never commit your \`.env.local\` file to version control!

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🎨 How to Use

### First Time Setup

1. **Login**: Click any login button (it's currently using mock authentication)
2. **Create a Chat**: Click the "New" button in the left sidebar
3. **Configure Your Assistant**:
   - Choose an assistant personality (Mina, Echo, Nova, Sage, or Luna)
   - Set voice style (e.g., "warm", "energetic", "calm")
   - Define topic/intent (e.g., "Creative brainstorming")
   - Add custom instructions for how the assistant should behave

### Sending Messages

#### Text Messages
1. Type your message in the input field at the bottom
2. Press Enter or click the send button (arrow icon)
3. Assistant will respond with both text and voice

#### Voice Messages
1. Click the microphone button to start recording
2. Speak your message
3. Click again to stop recording
4. Your voice will be automatically transcribed and sent
5. Assistant responds with voice + text

### Adjusting Settings

1. Click the settings icon (⚙️) in the chat header
2. Modify:
   - Chat name
   - Voice style
   - Topic/intent
   - Custom instructions
   - OpenAI voice selection (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
3. Click "Save Changes"

## 🏗️ Project Structure

\`\`\`
src/
├── animations/         # GSAP animation utilities
├── app/
│   ├── login/         # Login page
│   └── page.tsx       # Main chat interface
├── components/
│   ├── ChatMessages.tsx    # Center panel - message interface
│   ├── ChatSettings.tsx    # Right panel - chat settings
│   ├── ChatSidebar.tsx     # Left panel - chat list
│   ├── ChatWorkspace.tsx   # Main layout wrapper
│   ├── NewChatModal.tsx    # Modal for creating new chats
│   └── ProtectedRoute.tsx  # Auth wrapper
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── hooks/
│   ├── useChatSessions.ts        # Chat management
│   └── useVoiceRecording.ts      # Voice recording logic
├── lib/
│   ├── gsapClient.ts       # GSAP configuration
│   └── openai.ts           # OpenAI API integration
└── types/
    ├── assistant.ts        # Assistant type definitions
    └── chat.ts             # Chat and message types
\`\`\`

## 🎤 OpenAI Features Used

### 1. Speech-to-Text (Whisper)
- Model: \`whisper-1\`
- Used when you record voice messages
- Converts your speech to text automatically

### 2. Text-to-Speech
- Model: \`tts-1\`
- Available voices: alloy, echo, fable, onyx, nova, shimmer
- Assistant responses are converted to speech

### 3. Chat Completions
- Model: \`gpt-4-turbo-preview\`
- Generates intelligent responses based on conversation history
- Uses custom instructions from chat settings

## 📱 Responsive Design

### Mobile (< 640px)
- Hamburger menu for sidebar
- Full-screen chat interface
- Slide-in settings panel
- Touch-optimized buttons

### Tablet (640px - 1024px)
- Persistent sidebar
- Centered chat interface
- Toggle settings panel

### Desktop (> 1024px)
- 3-column Telegram-style layout
- Chat list always visible on left
- Messages in center
- Settings panel on right (toggleable)

## 🎭 Available Assistants

1. **Mina** (Warm & Creative) - Your creative brainstorming partner
2. **Echo** (Deep & Thoughtful) - Your philosophical companion
3. **Nova** (Bright & Energetic) - Your motivational friend
4. **Sage** (Calm & Wise) - Your mindful guide
5. **Luna** (Soft & Dreamy) - Your late-night confidant

## ⚙️ Customization

### Adding New Assistants

Edit \`assistants.json\`:

\`\`\`json
{
  "assistants": [
    {
      "id": "custom-assistant",
      "name": "Custom",
      "voiceTag": "Your Voice Style",
      "description": "Your description",
      "mood": "Default greeting",
      "avatarColor": "#FF5733",
      "accentColor": "#FF8C66"
    }
  ]
}
\`\`\`

### Changing OpenAI Models

Edit \`src/lib/openai.ts\`:

\`\`\`typescript
// Change chat model
model: "gpt-4" // or "gpt-3.5-turbo"

// Change TTS model
model: "tts-1-hd" // for higher quality
\`\`\`

## 🐛 Troubleshooting

### "OpenAI API key not configured" Error
- Make sure \`.env.local\` file exists
- Verify the API key is correct
- Restart the dev server after adding the key

### Voice Recording Not Working
- Check browser permissions for microphone access
- Try using HTTPS or localhost (some browsers require secure context)
- Test with a different browser

### Assistant Not Responding
- Check browser console for errors
- Verify OpenAI API key has sufficient credits
- Check your OpenAI API usage at [https://platform.openai.com/usage](https://platform.openai.com/usage)

## 💰 OpenAI Costs

Approximate costs (as of 2024):
- **Whisper (speech-to-text)**: $0.006 per minute
- **TTS (text-to-speech)**: $15 per 1M characters
- **GPT-4**: $10 per 1M tokens (input), $30 per 1M tokens (output)

Set usage limits in your OpenAI dashboard to control costs!

## 🔒 Production Considerations

⚠️ **Current setup is for development only!**

For production:
1. Move API calls to server-side API routes
2. Remove \`dangerouslyAllowBrowser: true\` from OpenAI client
3. Implement proper authentication (NextAuth.js)
4. Add rate limiting
5. Store messages in a database
6. Implement proper error handling and logging

## 📚 Learn More

- [OpenAI Audio API Docs](https://platform.openai.com/docs/guides/audio)
- [Next.js Documentation](https://nextjs.org/docs)
- [GSAP Documentation](https://gsap.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is for educational purposes. Make sure to comply with OpenAI's usage policies.
