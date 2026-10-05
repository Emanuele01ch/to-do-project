# Create directory and enter directory
# mkdir server
# cd server
# npm init -y          <--  creates package.json
# npm install express
#
#
#
# server/package.json:
#
# "type": "module",
# "scripts": {
#   "dev": "node --watch index.js"
#  },
#
# "type": "module" enables import syntax.
# npm run dev restarts on code changes, but not on .env changes (restart manually).
#
# on server/index.js import express, then:
#
# const app = express();
# const PORT = 3000;
#
# And:

# app.listen(PORT, () => {
#  console.log(`Server running on http://localhost:${PORT}`);
# });
#
# Now create code
