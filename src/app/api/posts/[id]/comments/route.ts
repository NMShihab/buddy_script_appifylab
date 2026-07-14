import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/auth";

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
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);

    const parentId = searchParams.get("parentId");
    const where: Record<string, unknown> = { postId, parentId: parentId || null };

    if (cursor) {
      where.createdAt = { gt: new Date(cursor) };
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: limit,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        _count: { select: { replies: true } },
      },
    });

    const commentIds = comments.map((c) => c.id);
    const userLikes = await prisma.commentLike.findMany({
      where: { commentId: { in: commentIds }, userId: session.userId },
      select: { commentId: true },
    });
    const likedIds = new Set(userLikes.map((l) => l.commentId));

    const result = comments.map((c) => ({
      ...c,
      isLiked: likedIds.has(c.id),
      replyCount: c._count.replies,
      _count: undefined,
    }));

    let nextCursor: string | null = null;
    if (comments.length === limit) {
      nextCursor = comments[comments.length - 1].createdAt.toISOString();
    }

    return NextResponse.json({ comments: result, nextCursor });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
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
    const body = await request.json();
    const { content, parentId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.postId !== postId) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
    }

    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content: content.trim(),
          postId,
          authorId: session.userId,
          parentId: parentId || null,
        },
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(
      { ...comment, isLiked: false, replyCount: 0 },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
