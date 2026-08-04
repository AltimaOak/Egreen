-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "features" JSONB,
ADD COLUMN     "gallery" JSONB,
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "offerPrice" DECIMAL(10,2),
ADD COLUMN     "rating" DECIMAL(3,1),
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;
