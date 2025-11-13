# Voice Assistant Setup

## OpenAI API Key Setup

To enable voice features, you need to add your OpenAI API key:

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Add it to your `.env` file:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. Restart your development server:

```bash
npm run dev
```

## Voice Features

- **Text-to-Speech**: Uses OpenAI's TTS API with 6 different voices
- **Voice Preview**: Test each voice before saving an assistant
- **Multiple Assistants**: Create different AI personalities with unique voices

## Available Voices

### Male Voices

- **Alloy**: Neutral and balanced
- **Echo**: Deep and resonant
- **Fable**: Warm and expressive

### Female Voices

- **Nova**: Bright and energetic
- **Shimmer**: Soft and gentle
- **Onyx**: Rich and smooth

## Usage

1. Click the **+** button in the left sidebar
2. Enter assistant name
3. Select gender (male/female)
4. Choose a voice and test it with the play button
5. Click "Save Assistant"
6. Your new assistant appears in the left sidebar!
