DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'my_app_dev') THEN 
        CREATE DATABASE my_app_dev; 
    END IF; 
END $$;

\c my_app_dev;

CREATE TABLE IF NOT EXISTS doctors (
    "id" SERIAL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    "id" SERIAL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    "id" SERIAL PRIMARY KEY,
    "patientId" INT NOT NULL,
    "doctorId" INT NOT NULL,
    "time" TIMESTAMP NOT NULL,
    "kind" TEXT NOT NULL,
    FOREIGN KEY ("doctorId") REFERENCES "doctors"("id"),
    FOREIGN KEY ("patientId") REFERENCES "patients"("id")
);

INSERT INTO patients ("firstName", "lastName")
VALUES ('John', 'Doe'),
       ('Abc', 'Def'),
       ('Jsadfs', 'Koivjodsi'),
       ('Jane', 'Smith');

INSERT INTO doctors ("firstName", "lastName", "email")
VALUES ('Michael', 'Johnson', 'michael@example.com'),
       ('Sarah', 'Williams', 'sarah@example.com');

INSERT INTO appointments ("patientId", "doctorId", "time", "kind")
VALUES (1, 1, '2024-06-01 19:00:25-07', 'Follow-up'),
       (1, 2, '2024-06-01 20:00:25-07', 'New Patient'),
       (2, 1, '2024-06-01 21:00:25-07', 'New Patient'),
       (2, 2, '2024-06-01 22:00:25-07', 'New Patient'),
       (3, 1, '2024-06-01 23:00:25-07', 'Follow-up'),
       (4, 2, '2024-06-01 18:00:25-07', 'New Patient');
