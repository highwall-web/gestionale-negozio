CREATE TABLE IF NOT EXISTS brands (
    id          BIGSERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS colors (
    id          BIGSERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS models (
    id                BIGSERIAL PRIMARY KEY,
    nome              VARCHAR(255) NOT NULL UNIQUE,
    tipo_dispositivo  VARCHAR(50)  NOT NULL,
    brand_id          BIGINT       NOT NULL REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS customers (
    id                    BIGSERIAL PRIMARY KEY,
    nome                  VARCHAR(255) NOT NULL,
    cognome               VARCHAR(255) NOT NULL,
    email                 VARCHAR(255) NOT NULL,
    indirizzo             VARCHAR(255),
    citta                 VARCHAR(255),
    cap                   VARCHAR(255),
    telefono              VARCHAR(255) NOT NULL,
    telefono_secondario   VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id             BIGSERIAL PRIMARY KEY,
    username       VARCHAR(255) NOT NULL UNIQUE,
    email          VARCHAR(255) UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           VARCHAR(50)  NOT NULL,
    enabled        BOOLEAN      NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    token       VARCHAR(512) NOT NULL UNIQUE,
    user_id     BIGINT       NOT NULL REFERENCES users(id),
    expires_at  TIMESTAMP    NOT NULL,
    revoked     BOOLEAN      NOT NULL
);

CREATE TABLE IF NOT EXISTS repairs (
    id                 BIGSERIAL PRIMARY KEY,
    customer_id        BIGINT         NOT NULL REFERENCES customers(id),
    stato              VARCHAR(50),
    stato_riparazione  VARCHAR(100),
    costo_totale       NUMERIC(38, 2),
    created_at         TIMESTAMP      NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id                        BIGSERIAL PRIMARY KEY,
    repair_id                 BIGINT REFERENCES repairs(id),
    model_id                  BIGINT  NOT NULL REFERENCES models(id),
    color_id                  BIGINT  NOT NULL REFERENCES colors(id),
    capacita                  VARCHAR(255),
    codice_unlock             VARCHAR(255),
    sequenza_unlock           TEXT,
    pin                       VARCHAR(255),
    accessori                 VARCHAR(255),
    contatto_con_liquidi      BOOLEAN,
    dispositivo_non_testabile BOOLEAN,
    acquistato_presso_di_noi  BOOLEAN,
    seriale                   VARCHAR(255),
    imei                      VARCHAR(255),
    codice_modello            VARCHAR(255),
    lasciato_in_negozio       BOOLEAN,
    test_diagnostici          JSONB
);

CREATE TABLE IF NOT EXISTS interventions (
    id                BIGSERIAL PRIMARY KEY,
    model_id          BIGINT REFERENCES models(id),
    nome              VARCHAR(255)   NOT NULL,
    prezzo            NUMERIC(38, 2) NOT NULL,
    periodo_garanzia  INTEGER,
    cumulabile        BOOLEAN,
    attivo            BOOLEAN        NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS repair_details (
    id             BIGSERIAL PRIMARY KEY,
    repair_id      BIGINT  NOT NULL UNIQUE REFERENCES repairs(id),
    is_preventivo  BOOLEAN NOT NULL,
    data_consegna  DATE,
    acconto        NUMERIC(38, 2)
);

CREATE TABLE IF NOT EXISTS repair_details_interventions (
    id                  BIGSERIAL PRIMARY KEY,
    repair_details_id   BIGINT  NOT NULL REFERENCES repair_details(id),
    intervention_id     BIGINT  NOT NULL REFERENCES interventions(id),
    quantita            INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS repair_messages (
    id                  BIGSERIAL PRIMARY KEY,
    repair_details_id   BIGINT    NOT NULL REFERENCES repair_details(id),
    testo               TEXT      NOT NULL,
    autore              VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP NOT NULL
);
