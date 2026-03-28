const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const mysql = require('mysql2');

// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // change if needed
  password: '',        // your MySQL password
  database: 'winnie'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.log("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});
// Save form data
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).send("All fields are required");
  }

  const sql = "INSERT INTO contact (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.log("Database error:", err);
      return res.status(500).send("Error saving data.");
    }

    res.send("Thank you! Data saved successfully.");
  });
});
//view inserted data
app.get('/admin/contacts', (req, res) => {
  db.query("SELECT * FROM contact", (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Error fetching data");
    }

    // Make sure 'results' is an array
    if (!Array.isArray(results)) {
      console.log(results);
      return res.send("Invalid data returned");
    }

    res.render('admin', { contacts: results });
  });
});
//deleting contact info
app.post('/delete/:id', (req, res) => {
  const sql = "DELETE FROM contact WHERE id = ?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error deleting contact");
    }

    res.redirect('/admin/contacts'); // go back to admin dashboard
  });
});
//editing contact info
app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM contact WHERE id = ?";
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.send("Error fetching contact");

    if (results.length === 0) return res.send("Contact not found");

    res.render('edit', { contact: results[0] }); // Pass to EJS
  });
});

//updating info
app.post('/update/:id', (req, res) => {
  const { name, email, message } = req.body;
  const sql = "UPDATE contact SET name = ?, email = ?, message = ? WHERE id = ?";

  db.query(sql, [name, email, message, req.params.id], (err) => {
    if (err) return res.send("Error updating contact");

    res.redirect('/admin/contacts'); // Back to admin dashboard
  });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});