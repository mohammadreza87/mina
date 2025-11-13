# Requirements Document

## Introduction

Mina is a voice-first assistant application built with Next.js 15 and React that enables users to have natural, real-time voice conversations with AI assistants. The system leverages OpenAI's Realtime API via WebRTC for low-latency streaming speech input and output, supports multiple assistant personalities, implements conversation memory via Supabase, and provides a modern, minimal user interface with smooth animations.

## Glossary

- **Mina System**: The complete voice-first assistant application
- **Voice Session**: A real-time audio conversation between a user and an assistant
- **Assistant Profile**: A configuration defining an assistant's name, personality traits, and voice characteristics
- **Conversation Memory**: Persistent storage of session data including summaries and recent topics
- **Barge-in**: The capability to interrupt assistant speech when the user begins speaking
- **VAD**: Voice Activity Detection - technology to detect when a user is speaking
- **WebRTC Stream**: Real-time communication protocol for audio streaming
- **Realtime API**: OpenAI's streaming API for live speech-to-speech interaction
- **Session Recap**: A summary of previous conversation topics presented when reopening an assistant

## Requirements

### Requirement 1

**User Story:** As a user, I want to select from multiple AI assistants with different personalities, so that I can choose the conversation style that suits my needs

#### Acceptance Criteria

1. THE Mina System SHALL load assistant configurations from an assistants.json file containing name, personality, and voice parameters
2. THE Mina System SHALL display available assistants in a horizontal carousel interface
3. WHEN a user selects an assistant from the carousel, THE Mina System SHALL highlight the selected assistant and enable the call initiation control
4. THE Mina System SHALL persist the user's assistant selection across page navigation within the same session

### Requirement 2

**User Story:** As a user, I want to initiate a voice conversation by pressing a call button, so that I can start talking to my chosen assistant

#### Acceptance Criteria

1. THE Mina System SHALL display a prominent call button that is only enabled when an assistant is selected
2. WHEN a user presses the call button, THE Mina System SHALL request microphone permissions if not already granted
3. WHEN microphone access is granted, THE Mina System SHALL establish a WebRTC connection to the OpenAI Realtime API
4. WHEN the WebRTC connection is established, THE Mina System SHALL transition the interface to an active call state within 2 seconds
5. IF microphone access is denied, THEN THE Mina System SHALL display an error message explaining that microphone access is required

### Requirement 3

**User Story:** As a user, I want my voice to be captured and sent to the AI in real-time, so that I can have a natural conversation without delays

#### Acceptance Criteria

1. WHILE a Voice Session is active, THE Mina System SHALL continuously capture audio from the user's microphone
2. WHILE a Voice Session is active, THE Mina System SHALL stream captured audio to the OpenAI Realtime API via WebRTC with latency under 200 milliseconds
3. WHILE a Voice Session is active, THE Mina System SHALL implement VAD to detect when the user is speaking
4. THE Mina System SHALL encode audio in a format compatible with the OpenAI Realtime API requirements

### Requirement 4

**User Story:** As a user, I want to hear the assistant's responses immediately as they are generated, so that the conversation feels natural and responsive

#### Acceptance Criteria

1. WHEN the OpenAI Realtime API sends audio response data, THE Mina System SHALL begin playback within 100 milliseconds of receiving the first audio chunk
2. WHILE receiving streamed audio from the Realtime API, THE Mina System SHALL play audio continuously without buffering gaps
3. THE Mina System SHALL use the voice characteristics specified in the selected Assistant Profile for all responses
4. THE Mina System SHALL maintain audio playback quality with minimal distortion or artifacts

### Requirement 5

**User Story:** As a user, I want to interrupt the assistant when it's speaking, so that I can redirect the conversation naturally like in human dialogue

#### Acceptance Criteria

1. WHILE the Mina System is playing assistant audio, THE Mina System SHALL monitor for user speech via VAD
2. WHEN VAD detects user speech during assistant playback, THE Mina System SHALL pause assistant audio playback within 50 milliseconds
3. WHEN the user stops speaking after a barge-in, THE Mina System SHALL resume processing the user's input without resuming the interrupted assistant response
4. THE Mina System SHALL clear any queued assistant audio when a barge-in occurs

### Requirement 6

**User Story:** As a user, I want my conversations to be remembered, so that the assistant can reference previous topics when I return

#### Acceptance Criteria

1. WHEN a Voice Session begins, THE Mina System SHALL create a session record in Supabase containing session identifier, assistant identifier, and timestamp
2. WHILE a Voice Session is active, THE Mina System SHALL store conversation summary data in Supabase
3. WHEN a Voice Session ends, THE Mina System SHALL update the session record with recent topics discussed and a conversation summary
4. THE Mina System SHALL associate all Conversation Memory records with the specific Assistant Profile used in that session

### Requirement 7

**User Story:** As a returning user, I want to see a recap of my last conversation when I select an assistant, so that I can continue where we left off

#### Acceptance Criteria

1. WHEN a user selects an Assistant Profile, THE Mina System SHALL query Supabase for the most recent session with that assistant
2. IF a previous session exists, THEN THE Mina System SHALL display a recap message showing recent topics from that session
3. THE Mina System SHALL format the recap message to include a maximum of 3 recent topics
4. WHEN a Voice Session begins with an assistant that has Conversation Memory, THE Mina System SHALL provide the session context to the Realtime API

### Requirement 8

**User Story:** As a user, I want a clean and modern interface that is easy to use, so that I can focus on the conversation without distractions

#### Acceptance Criteria

1. THE Mina System SHALL implement a dark background color scheme with neon accent colors
2. THE Mina System SHALL display the call button with a minimum touch target size of 64x64 pixels
3. THE Mina System SHALL use Framer Motion to animate transitions between interface states
4. THE Mina System SHALL display the assistant carousel with smooth horizontal scrolling
5. THE Mina System SHALL apply TailwindCSS utility classes for all styling implementations

### Requirement 9

**User Story:** As a user, I want to end a voice conversation when I'm finished, so that I can control when the session terminates

#### Acceptance Criteria

1. WHILE a Voice Session is active, THE Mina System SHALL display a control to end the call
2. WHEN a user activates the end call control, THE Mina System SHALL close the WebRTC connection within 1 second
3. WHEN a Voice Session ends, THE Mina System SHALL stop microphone capture and audio playback
4. WHEN a Voice Session ends, THE Mina System SHALL return the interface to the assistant selection state

### Requirement 10

**User Story:** As a developer, I want the codebase to be modular and well-organized, so that I can maintain and extend the application easily

#### Acceptance Criteria

1. THE Mina System SHALL organize audio handling logic in a dedicated /lib/audio module
2. THE Mina System SHALL organize OpenAI Realtime API integration in a dedicated /lib/llm module
3. THE Mina System SHALL organize Supabase memory operations in a dedicated /lib/memory module
4. THE Mina System SHALL implement the call interface as a dedicated route at /app/call
5. THE Mina System SHALL include code comments explaining complex logic and API interactions
6. THE Mina System SHALL use TypeScript with strict type checking for all modules
