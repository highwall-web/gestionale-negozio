ALTER TABLE "repair_details_interventions" ADD COLUMN "prezzo_unitario" numeric(38, 2);--> statement-breakpoint
UPDATE "repair_details_interventions" rdi
SET "prezzo_unitario" = i.prezzo
FROM "interventions" i
WHERE rdi.intervention_id = i.id;--> statement-breakpoint
ALTER TABLE "repair_details_interventions" ALTER COLUMN "prezzo_unitario" SET NOT NULL;
