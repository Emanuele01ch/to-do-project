# Why we split the files

Main idea: **each file has one job**, so when something changes you know which file to open.

## Server
- `index.js`: only starts the server.
- `app.js`: sets up the app (middleware) and says which URL goes to which router.
- `db.js`: the only place that knows how to connect to MySQL.
- `routes/todos.js`: what happens for each `/api/todos` request. New routes go here and `app.js` stays small.

## React
- `App.jsx`: holds the data (state) and the handlers. It decides what happens.
- `api/todos.js`: the only place that knows URLs and `fetch`. If the API changes, edit one file.
- `components/`: only draw things on the screen and report clicks. They don't know about the API.
  - `TodoForm`: the input.
  - `TodoList`: the list.
  - `TodoItem`: one row.

  
## One-line rule
Screen in `components`, data and logic in `App`, requests in `api`. On the server: URLs in `routes`, setup in `app.js`.