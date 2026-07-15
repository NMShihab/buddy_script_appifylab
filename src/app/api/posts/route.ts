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
    const { content, imageUrls, visibility } = body;

    if (!content?.trim() && (!imageUrls || imageUrls.length === 0)) {
      return NextResponse.json(
        { error: "Post content or images required" },
        { status: 400 }
      );
    }

    if (content && content.length > 5000) {
      return NextResponse.json(
        { error: "Post content must be under 5000 characters" },
        { status: 400 }
      );
    }

    const validVisibility = visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";
    const validImageUrls: string[] = Array.isArray(imageUrls)
      ? imageUrls.filter((u: unknown) => typeof u === "string" && u.trim())
      : [];

    const post = await prisma.post.create({
      data: {
        content: content?.trim() || "",
        imageUrls: validImageUrls,
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

    const [userLikes, recentLikes] = await Promise.all([
      prisma.postLike.findMany({
        where: { postId: { in: postIds }, userId: session.userId },
        select: { postId: true, reactionType: true },
      }),
      prisma.postLike.findMany({
        where: { postId: { in: postIds } },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
      }),
    ]);

    const likesByPost = new Map(userLikes.map((l) => [l.postId, l.reactionType]));

    const likersByPost = new Map<string, typeof recentLikes>();
    for (const like of recentLikes) {
      const existing = likersByPost.get(like.postId) ?? [];
      if (existing.length < 3) {
        existing.push(like);
        likersByPost.set(like.postId, existing);
      }
    }

    const postsWithLiked = posts.map((post) => ({
      ...post,
      isLiked: likesByPost.has(post.id),
      reactionType: likesByPost.get(post.id) ?? null,
      recentLikers: (likersByPost.get(post.id) ?? []).map((l) => l.user),
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
