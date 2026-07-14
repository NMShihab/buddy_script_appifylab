import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/auth";

async function getRecentLikers(postId: string, limit = 3) {
  const likes = await prisma.postLike.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
  });
  return likes.map((l) => l.user);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const where: Record<string, unknown> = { postId };
    if (cursor) {
      where.createdAt = { lt: new Date(cursor) };
    }

    const likes = await prisma.postLike.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    let nextCursor: string | null = null;
    if (likes.length === limit) {
      nextCursor = likes[likes.length - 1].createdAt.toISOString();
    }

    return NextResponse.json({
      likers: likes.map((l) => l.user),
      nextCursor,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch likers" },
      { status: 500 }
    );
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;

    const existing = await prisma.postLike.findUnique({
      where: {
        unique_post_like: { postId, userId: session.userId },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.postLike.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      });

      const recentLikers = await getRecentLikers(postId);

      return NextResponse.json({
        liked: false,
        likesCount: post?.likesCount ?? 0,
        recentLikers,
      });
    } else {
      await prisma.$transaction([
        prisma.postLike.create({
          data: { postId, userId: session.userId },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      });

      const recentLikers = await getRecentLikers(postId);

      return NextResponse.json({
        liked: true,
        likesCount: post?.likesCount ?? 0,
        recentLikers,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
