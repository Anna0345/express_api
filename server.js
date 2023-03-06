const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT
)`);


app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
});


app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else if (row) {
      res.send(row);
    } else {
      res.status(404).send('Product not found');
    }
  });
});


app.post('/products', (req, res) => {
  const { name, description, price, image } = req.body;
  const sql = `INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)`;
  const params = [name, description, price, image];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
      res.send({ id: this.lastID });
    }
  });
});


app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, price, image } = req.body;
  const sql = `UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?`;
  const params = [name, description, price, image, id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
      res.send({ message: `Product ${id} updated` });
    }
  });
});


app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM products WHERE id = ?`;
  db.run(sql, [id], (err) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
      res.send({ message: `Product ${id} deleted` });
    }
  });
});


app.all('*', (req, res) => {
  res.status(404).send('<h1>Resource not found</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/products`);
});


