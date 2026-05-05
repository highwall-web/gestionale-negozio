-- 1. Drop FK constraints che referenziano repairs.id
ALTER TABLE "products" DROP CONSTRAINT "products_repair_id_repairs_id_fk";--> statement-breakpoint
ALTER TABLE "repair_details" DROP CONSTRAINT "repair_details_repair_id_repairs_id_fk";--> statement-breakpoint

-- 2. Rimuovi il default sequenza da repairs.id e cambia tipo
ALTER TABLE "repairs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "repairs" ALTER COLUMN "id" SET DATA TYPE varchar(6) USING id::varchar(6);--> statement-breakpoint
DROP SEQUENCE IF EXISTS "repairs_id_seq";--> statement-breakpoint

-- 3. Cambia tipo delle colonne FK
ALTER TABLE "products" ALTER COLUMN "repair_id" SET DATA TYPE varchar(6) USING repair_id::varchar(6);--> statement-breakpoint
ALTER TABLE "repair_details" ALTER COLUMN "repair_id" SET DATA TYPE varchar(6) USING repair_id::varchar(6);--> statement-breakpoint

-- 4. Ricrea i vincoli FK
ALTER TABLE "products" ADD CONSTRAINT "products_repair_id_repairs_id_fk" FOREIGN KEY ("repair_id") REFERENCES "public"."repairs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_details" ADD CONSTRAINT "repair_details_repair_id_repairs_id_fk" FOREIGN KEY ("repair_id") REFERENCES "public"."repairs"("id") ON DELETE no action ON UPDATE no action;
