CREATE TABLE "events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"descrizione" varchar(500) NOT NULL,
	"data_evento" date NOT NULL,
	"ora_inizio" time NOT NULL,
	"ora_fine" time NOT NULL
);
