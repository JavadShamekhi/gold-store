/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- Add the column with a default value for existing rows
ALTER TABLE "User" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Unknown';

-- Remove the default so future insertions require a name
ALTER TABLE "User" ALTER COLUMN "name" DROP DEFAULT;
