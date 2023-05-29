-- //Run the below in terminal to get output:
-- //psql -f playground.sql > psql-output.txt

\c nc_games

-- SELECT * FROM categories;

-- SELECT * FROM users;

-- SELECT * FROM reviews ORDER BY created_at;

-- SELECT * FROM comments WHERE review_id = 3;

-- SELECT EXISTS(SELECT 1 FROM reviews WHERE review_id = 9999999)

-- INSERT INTO comments (review_id, author, body)
-- VALUES (3, 'tickle122', 'Awesome!')
-- RETURNING review_id, author, body;

SELECT EXISTS(SELECT 1 FROM users WHERE username = 'notavalidname');