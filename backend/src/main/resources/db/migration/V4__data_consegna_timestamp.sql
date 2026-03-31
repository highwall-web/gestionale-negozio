ALTER TABLE repair_details
    ALTER COLUMN data_consegna TYPE TIMESTAMP USING data_consegna::TIMESTAMP;
