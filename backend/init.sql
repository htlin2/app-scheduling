DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'my_app_dev') THEN 
        CREATE DATABASE my_app_dev; 
    END IF; 
END $$;

\c my_app_dev;
