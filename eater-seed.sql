

-- "testadmin" pwd is "password"
-- figure out better way to make admin
INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Tyler',
        'Robison',
        'tyler@yahoo.com',
        TRUE),
       ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Bobby',
        'Buckus',
        'bobby@yahoo.com',
        FALSE);