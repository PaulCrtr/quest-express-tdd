// app.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./connection");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.post("/bookmarks", (req, res) => {
  if (!req.body.url || !req.body.title) {
    res.status(422).json({ error: "required field(s) missing" });
  } else {
    connection.query("INSERT INTO bookmark SET ?", req.body, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Failed to save a bookmark");
      } else {
        connection.query(
          `SELECT * FROM bookmark WHERE id=?`,
          results.insertId,
          (_, results2) => {
            res.status(201).json(results2[0]);
          }
        );
      }
    });
  }
});

app.get("/bookmarks/:id", (req, res) => {
  connection.query(
    `SELECT * FROM bookmark WHERE id=?`,
    req.params.id,
    (err, results) => {
      if (err || results.length === 0) {
        res.status(404).json({ error: "Bookmark not found" });
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
});

module.exports = app;
