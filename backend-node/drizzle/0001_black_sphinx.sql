CREATE TABLE "repair_details_interventions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"repair_details_id" bigint NOT NULL,
	"intervention_id" bigint NOT NULL,
	"quantita" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repair_messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"repair_details_id" bigint NOT NULL,
	"testo" text NOT NULL,
	"autore" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "repair_details_interventions" ADD CONSTRAINT "repair_details_interventions_repair_details_id_repair_details_id_fk" FOREIGN KEY ("repair_details_id") REFERENCES "public"."repair_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_details_interventions" ADD CONSTRAINT "repair_details_interventions_intervention_id_interventions_id_fk" FOREIGN KEY ("intervention_id") REFERENCES "public"."interventions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_messages" ADD CONSTRAINT "repair_messages_repair_details_id_repair_details_id_fk" FOREIGN KEY ("repair_details_id") REFERENCES "public"."repair_details"("id") ON DELETE no action ON UPDATE no action;