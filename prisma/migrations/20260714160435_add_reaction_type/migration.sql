-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'HAHA', 'HEART');

-- AlterTable
ALTER TABLE "PostLike" ADD COLUMN     "reactionType" "ReactionType" NOT NULL DEFAULT 'LIKE';
