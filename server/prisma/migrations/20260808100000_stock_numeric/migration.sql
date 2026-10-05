-- Convert Product.stock from a string label to a numeric unit count.
-- Existing labels are mapped safely: "Out of stock" -> 0, "Low Stock" -> 3,
-- anything else (e.g. "In Stock") -> 10.
ALTER TABLE "Product" ALTER COLUMN "stock" DROP DEFAULT;

ALTER TABLE "Product" ALTER COLUMN "stock" SET DATA TYPE INTEGER USING (
  CASE lower(btrim("stock"))
    WHEN 'out of stock' THEN 0
    WHEN 'low stock' THEN 3
    ELSE 10
  END
);

ALTER TABLE "Product" ALTER COLUMN "stock" SET DEFAULT 0;