# Create the MySQL database and todos table that the Express API will sit on top of.
#
# Your answer to question 1 is right. MySQL guarantees unique ids. Two other reasons are that the client can't pick or tamper with ids, and two requests arriving at the same moment can't collide, because the database assigns the numbers one at a time.
#
# CREATE DATABASE todo_app
#   CHARACTER SET utf8mb4
#   COLLATE utf8mb4_unicode_ci;
#
# USE todo_app;
#
# CREATE TABLE todos (
#   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
#   title VARCHAR(255) NOT NULL,
#   completed BOOLEAN NOT NULL DEFAULT FALSE,
#   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
# );

# INSERT INTO todos (title) VALUES
#   ('Learn Express routing'),
#   ('Connect Express to MySQL');