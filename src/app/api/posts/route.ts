import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, imageUrl, visibility } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Post content must be under 5000 characters" },
        { status: 400 }
      );
    }

    const validVisibility = visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        imageUrl: imageUrl || null,
        visibility: validVisibility,
        authorId: session.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const where = {
      OR: [
        { visibility: "PUBLIC" as const },
        { authorId: session.userId },
      ],
    };

    let cursorCondition = {};
    if (cursor) {
      const [cursorDate, cursorId] = cursor.split("_");
      cursorCondition = {
        OR: [
          { createdAt: { lt: new Date(cursorDate) } },
          {
            createdAt: new Date(cursorDate),
            id: { lt: cursorId },
          },
        ],
      };
    }

    const posts = await prisma.post.findMany({
      where: { ...where, ...cursorCondition },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    const postIds = posts.map((p) => p.id);
    const userLikes = await prisma.postLike.findMany({
      where: {
        postId: { in: postIds },
        userId: session.userId,
      },
      select: { postId: true },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    const postsWithLiked = posts.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post.id),
    }));

    let nextCursor: string | null = null;
    if (posts.length === limit) {
      const last = posts[posts.length - 1];
      nextCursor = `${last.createdAt.toISOString()}_${last.id}`;
    }

    return NextResponse.json({
      posts: postsWithLiked,
      nextCursor,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
