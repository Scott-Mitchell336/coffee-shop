-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_item_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "item_id",
DROP COLUMN IF EXISTS "instructions",
DROP COLUMN IF EXISTS "quantity";

-- CreateTable
CREATE TABLE "cart_item_details" (
  "id" SERIAL NOT NULL,
  "cart_item_id" INTEGER,
  "item_id" INTEGER,
  "instructions" TEXT,
  "quantity" INTEGER DEFAULT 1,
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "cart_item_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cart_item_details" ADD CONSTRAINT "cart_item_details_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "cart_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item_details" ADD CONSTRAINT "cart_item_details_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
