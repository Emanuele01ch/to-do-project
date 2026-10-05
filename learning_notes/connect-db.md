# Connect to MySQL
#
# Inside Server folder:
# npm install mysql2 dotenv
#
#
# server/.env (exact name, inside server/):
#
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=todo_app
#
# server/.gitignore:
# .env  <-- Stores db credentials and info
#
# The .env file contains secrets: your database password and other private settings. If you commit it, it goes to GitHub with everything else, and anyone who sees the repository (especially if it's public) can read it. Bots actively scan GitHub for leaked passwords and keys, and removing the file later doesn't erase it from your Git history.
#
# import 'dotenv/config';
# import mysql from 'mysql2/promise';
# 
# const pool = mysql.createPool({
#   host: process.env.DB_HOST,
#   port: process.env.DB_PORT,
#   user: process.env.DB_USER,
#   password: process.env.DB_PASSWORD,
#   database: process.env.DB_NAME,
# });
# 
# export default pool;