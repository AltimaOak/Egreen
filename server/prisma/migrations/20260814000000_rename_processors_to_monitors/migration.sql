-- Rename Category processors to monitors
UPDATE "Category" SET "name" = 'Monitors', "slug" = 'monitors' WHERE "slug" = 'processors';

-- Reassign products that were in processors (now monitors) to components
UPDATE "Product" SET "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'components') WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'monitors');
