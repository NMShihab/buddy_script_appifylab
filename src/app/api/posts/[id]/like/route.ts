import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/auth";

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

      return NextResponse.json({ liked: false, likesCount: post?.likesCount ?? 0 });
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

      return NextResponse.json({ liked: true, likesCount: post?.likesCount ?? 0 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
