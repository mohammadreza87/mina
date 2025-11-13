import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { container } from '@/config/di/container';
import { TYPES } from '@/config/di/types';
import { SendMessageUseCase } from '@/core/use-cases/chat/SendMessageUseCase';
import { GetChatByIdUseCase } from '@/core/use-cases/chat/GetChatByIdUseCase';
import { AppError } from '@/shared/lib/errors/AppError';
import { NotFoundError } from '@/shared/lib/errors/NotFoundError';
import { ValidationError } from '@/shared/lib/errors/ValidationError';
import { authOptions } from '@/server/auth/authOptions';

/**
 * POST /api/chats/[id]/messages
 * Send a new message to a chat
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const getChatUseCase = container.get<GetChatByIdUseCase>(TYPES.GetChatByIdUseCase);
    const chatForValidation = await getChatUseCase.execute(params.id);

    if (chatForValidation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const useCase = container.get<SendMessageUseCase>(TYPES.SendMessageUseCase);

    const chat = await useCase.execute({
      chatId: params.id,
      role: body.role || 'user',
      content: body.content,
      type: body.type || 'text',
      audioUrl: body.audioUrl,
      duration: body.duration,
    });

    // Get the last message (the one we just added)
    const lastMessage = chat.messages[chat.messages.length - 1];

    // Return the newly created message
    return NextResponse.json({
      id: lastMessage.id.toString(),
      chatId: lastMessage.chatId,
      role: lastMessage.role,
      content: lastMessage.content,
      type: lastMessage.type,
      timestamp: lastMessage.timestamp.toISOString(),
      audioUrl: lastMessage.audioUrl,
      duration: lastMessage.duration,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
