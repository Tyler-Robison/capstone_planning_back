\echo 'Delete and recreate eater db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS eater;
CREATE DATABASE eater;
\connect eater

DROP TABLE IF EXISTS users;

\i eater-schema.sql
\i eater-seed.sql

\echo 'Delete and recreate eater_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS eater_test;
CREATE DATABASE eater_test;
\connect eater_test

DROP TABLE IF EXISTS users;

\i eater-schema.sql

