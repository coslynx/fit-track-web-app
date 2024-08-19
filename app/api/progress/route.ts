import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const progressSchema = z.object({
  goalId: z.string().uuid(),
  value: z.number().positive(),
  date: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const progressData = await prisma.progress.findMany({
      where: {
        goalId,
        userId: session.user.id,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(progressData);
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = progressSchema.parse(body);

    const goal = await prisma.goal.findUnique({
      where: { id: validatedData.goalId },
    });

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    const newProgress = await prisma.progress.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    await prisma.goal.update({
      where: { id: validatedData.goalId },
      data: { currentValue: validatedData.value },
    });

    return NextResponse.json(newProgress, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 });
    }

    const validatedData = progressSchema.partial().parse(updateData);

    const updatedProgress = await prisma.progress.updateMany({
      where: { id, userId: session.user.id },
      data: validatedData,
    });

    if (updatedProgress.count === 0) {
      return NextResponse.json({ error: 'Progress not found or unauthorized' }, { status: 404 });
    }

    const progress = await prisma.progress.findUnique({ where: { id } });

    if (progress && 'value' in validatedData) {
      await prisma.goal.update({
        where: { id: progress.goalId },
        data: { currentValue: validatedData.value },
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 });
    }

    const deletedProgress = await prisma.progress.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (deletedProgress.count === 0) {
      return NextResponse.json({ error: 'Progress not found or unauthorized' }, { status: 404 });
    }

    const latestProgress = await prisma.progress.findFirst({
      where: { goalId: deletedProgress.goalId },
      orderBy: { date: 'desc' },
    });

    if (latestProgress) {
      await prisma.goal.update({
        where: { id: latestProgress.goalId },
        data: { currentValue: latestProgress.value },
      });
    }

    return NextResponse.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}