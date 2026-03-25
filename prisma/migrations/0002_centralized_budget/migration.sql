-- Drop old FK constraint
ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "expenses_budgetId_fkey";

-- Remove spent from budgets, add notes
ALTER TABLE "budgets" DROP COLUMN IF EXISTS "spent";
ALTER TABLE "budgets" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- Remove budgetId from expenses, add budgetTag (plain text label)
ALTER TABLE "expenses" DROP COLUMN IF EXISTS "budgetId";
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "budgetTag" TEXT;
