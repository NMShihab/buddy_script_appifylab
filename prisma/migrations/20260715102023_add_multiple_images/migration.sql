-- AlterTable: add imageUrls column
ALTER TABLE "Post" ADD COLUMN "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing imageUrl data into imageUrls array
UPDATE "Post" SET "imageUrls" = ARRAY["imageUrl"] WHERE "imageUrl" IS NOT NULL;

-- Drop the old imageUrl column
ALTER TABLE "Post" DROP COLUMN "imageUrl";

-- Remove the default so Prisma manages it
ALTER TABLE "Post" ALTER COLUMN "imageUrls" DROP DEFAULT;
