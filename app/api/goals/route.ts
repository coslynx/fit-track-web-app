import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const goalSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  targetValue: z.number().positive(),
  unit: z.string().min(1).max(50),
  goalType: z.enum(['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'custom']),
  startDate: z.string().datetime(),
  targetDate: z.string().datetime(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
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
    const validatedData = goalSchema.parse(body);

    const newGoal = await prisma.goal.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        currentValue: 0,
      },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating goal:', error);
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
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const validatedData = goalSchema.partial().parse(updateData);

    const updatedGoal = await prisma.goal.updateMany({
      where: { id, userId: session.user.id },
      data: validatedData,
    });

    if (updatedGoal.count === 0) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    const goal = await prisma.goal.findUnique({ where: { id } });
    return NextResponse.json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating goal:', error);
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
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const deletedGoal = await prisma.goal.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (deletedGoal.count === 0) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}