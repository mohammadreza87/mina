import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { container } from '@/config/di/container';
import { TYPES } from '@/config/di/types';
import { GetChatByIdUseCase } from '@/core/use-cases/chat/GetChatByIdUseCase';
import { UpdateChatSettingsUseCase } from '@/core/use-cases/chat/UpdateChatSettingsUseCase';
import { DeleteChatUseCase } from '@/core/use-cases/chat/DeleteChatUseCase';
import { AppError } from '@/shared/lib/errors/AppError';
import { NotFoundError } from '@/shared/lib/errors/NotFoundError';
import { ValidationError } from '@/shared/lib/errors/ValidationError';
import { authOptions } from '@/server/auth/authOptions';

/**
 * GET /api/chats/[id]
 * Get a single chat by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const useCase = container.get<GetChatByIdUseCase>(TYPES.GetChatByIdUseCase);
    const chat = await useCase.execute(params.id);

    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Map domain entity to DTO
    return NextResponse.json({
      id: chat.id.toString(),
      userId: chat.userId,
      assistantId: chat.assistantId,
      title: chat.title,
      voiceStyle: chat.voiceStyle,
      topic: chat.topic,
      instructions: chat.instructions,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map((msg) => ({
        id: msg.id.toString(),
        chatId: msg.chatId,
        role: msg.role,
        content: msg.content,
        type: msg.type,
        timestamp: msg.timestamp.toISOString(),
        audioUrl: msg.audioUrl,
        duration: msg.duration,
      })),
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/chats/[id]
 * Update chat settings
 */
export async function PATCH(
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
    const existingChat = await getChatUseCase.execute(params.id);

    if (existingChat.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const useCase = container.get<UpdateChatSettingsUseCase>(TYPES.UpdateChatSettingsUseCase);

    const chat = await useCase.execute({
      chatId: params.id,
      title: body.title,
      voiceStyle: body.voiceStyle,
      topic: body.topic,
      instructions: body.instructions,
    });

    // Map domain entity to DTO
    return NextResponse.json({
      id: chat.id.toString(),
      userId: chat.userId,
      assistantId: chat.assistantId,
      title: chat.title,
      voiceStyle: chat.voiceStyle,
      topic: chat.topic,
      instructions: chat.instructions,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map((msg) => ({
        id: msg.id.toString(),
        chatId: msg.chatId,
        role: msg.role,
        content: msg.content,
        type: msg.type,
        timestamp: msg.timestamp.toISOString(),
        audioUrl: msg.audioUrl,
        duration: msg.duration,
      })),
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

    console.error('Error updating chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chats/[id]
 * Delete a chat
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const useCase = container.get<DeleteChatUseCase>(TYPES.DeleteChatUseCase);
    await useCase.execute(params.id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
