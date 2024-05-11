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
    "time" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    FOREIGN KEY ("doctorId") REFERENCES "doctors"("id"),
    FOREIGN KEY ("patientId") REFERENCES "patients"("id")
);

INSERT INTO patients ("firstName", "lastName")
VALUES ('John', 'Doe'),
       ('Jane', 'Smith');

INSERT INTO doctors ("firstName", "lastName", "email")
VALUES ('Michael', 'Johnson', 'michael@example.com'),
       ('Sarah', 'Williams', 'sarah@example.com');

INSERT INTO appointments ("patientId", "doctorId", "time", "kind")
VALUES (1, 1, '10:00', 'Follow-up'),
       (2, 2, '14:30', 'New Patient');
