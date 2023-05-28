-- //Run the below in terminal to get output:
-- //psql -f playground.sql > psql-output.txt

\c nc_games

-- SELECT * FROM categories;

-- SELECT * FROM reviews ORDER BY created_at;

SELECT * FROM comments WHERE review_id = 2;

SELECT EXISTS(SELECT 1 FROM reviews WHERE review_id = 9999999)