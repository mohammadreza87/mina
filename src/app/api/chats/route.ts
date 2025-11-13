import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { container } from '@/config/di/container';
import { TYPES } from '@/config/di/types';
import { CreateChatUseCase } from '@/core/use-cases/chat/CreateChatUseCase';
import { GetUserChatsUseCase } from '@/core/use-cases/chat/GetUserChatsUseCase';
import { ValidationError } from '@/shared/lib/errors/ValidationError';
import { AppError } from '@/shared/lib/errors/AppError';
import { authOptions } from '@/server/auth/authOptions';

/**
 * POST /api/chats
 * Create a new chat
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();

    // 3. Get use case from DI container
    const createChatUseCase = container.get<CreateChatUseCase>(TYPES.CreateChatUseCase);

    // 4. Execute use case
    const chat = await createChatUseCase.execute({
      userId: session.user.id,
      assistantId: body.assistantId,
      title: body.title,
      voiceStyle: body.voiceStyle,
      topic: body.topic,
      instructions: body.instructions || '',
    });

    // 5. Return response (DTO - don't expose domain entities directly)
    return NextResponse.json(
      {
        id: chat.id.toString(),
        userId: chat.userId,
        assistantId: chat.assistantId,
        title: chat.title,
        voiceStyle: chat.voiceStyle,
        topic: chat.topic,
        instructions: chat.instructions,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString(),
        messageCount: chat.getMessageCount(),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

/**
 * GET /api/chats
 * Get all chats for the current user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get use case from DI container
    const getUserChatsUseCase = container.get<GetUserChatsUseCase>(
      TYPES.GetUserChatsUseCase
    );

    // Execute use case
    const chats = await getUserChatsUseCase.execute(session.user.id);

    // Map to DTOs
    const chatDTOs = chats.map((chat) => ({
      id: chat.id.toString(),
      userId: chat.userId,
      assistantId: chat.assistantId,
      title: chat.title,
      voiceStyle: chat.voiceStyle,
      topic: chat.topic,
      instructions: chat.instructions,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messageCount: chat.getMessageCount(),
      lastMessage: chat.getLastMessage()?.content || '',
    }));

    return NextResponse.json(chatDTOs);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Centralized error handling
 */
function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        field: error.field,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}
