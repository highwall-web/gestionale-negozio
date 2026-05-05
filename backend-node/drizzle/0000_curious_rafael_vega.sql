CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"enabled" boolean NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"token" varchar(512) NOT NULL,
	"user_id" bigint NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked" boolean NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	CONSTRAINT "brands_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "colors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	CONSTRAINT "colors_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"tipo_dispositivo" varchar(50) NOT NULL,
	"brand_id" bigint NOT NULL,
	CONSTRAINT "models_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cognome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"indirizzo" varchar(255),
	"citta" varchar(255),
	"cap" varchar(255),
	"telefono" varchar(255) NOT NULL,
	"telefono_secondario" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "interventions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"model_id" bigint,
	"nome" varchar(255) NOT NULL,
	"prezzo" numeric(38, 2) NOT NULL,
	"periodo_garanzia" integer,
	"attivo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repairs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"customer_id" bigint NOT NULL,
	"stato" varchar(50),
	"stato_riparazione" varchar(100),
	"costo_totale" numeric(38, 2),
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"repair_id" bigint,
	"model_id" bigint NOT NULL,
	"color_id" bigint NOT NULL,
	"capacita" varchar(255),
	"codice_unlock" varchar(255),
	"sequenza_unlock" text,
	"pin" varchar(255),
	"accessori" varchar(255),
	"contatto_con_liquidi" boolean,
	"dispositivo_non_testabile" boolean,
	"acquistato_presso_di_noi" boolean,
	"seriale" varchar(255),
	"imei" varchar(255),
	"codice_modello" varchar(255),
	"lasciato_in_negozio" boolean,
	"test_diagnostici" jsonb
);
--> statement-breakpoint
CREATE TABLE "repair_details" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"repair_id" bigint NOT NULL,
	"is_preventivo" boolean NOT NULL,
	"data_consegna" timestamp,
	"data_riconsegna_effettiva" timestamp,
	"acconto" numeric(38, 2),
	CONSTRAINT "repair_details_repair_id_unique" UNIQUE("repair_id")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repairs" ADD CONSTRAINT "repairs_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_repair_id_repairs_id_fk" FOREIGN KEY ("repair_id") REFERENCES "public"."repairs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_details" ADD CONSTRAINT "repair_details_repair_id_repairs_id_fk" FOREIGN KEY ("repair_id") REFERENCES "public"."repairs"("id") ON DELETE no action ON UPDATE no action;