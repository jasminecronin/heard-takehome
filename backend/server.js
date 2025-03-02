const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = "./transactions.json";

app.use(cors());
app.use(express.json());

// Read transactions
app.get("/transactions", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    res.json(JSON.parse(data));
  });
});

// Add transaction
app.post("/transactions", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });

    const transactions = JSON.parse(data);
    const newTransaction = { ...req.body };
    transactions.push(newTransaction);

    fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.json(newTransaction);
    });
  });
});

// Update transaction
app.put("/transactions/:title", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });

    let transactions = JSON.parse(data);
    transactions = transactions.map((t) => (t.title === req.params.title ? { ...t, ...req.body } : t));

    fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.json(transactions.find((t) => t.title === req.params.title));
    });
  });
});

// Delete transaction
app.delete("/transactions/:id", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });

    let transactions = JSON.parse(data);
    transactions = transactions.filter((t) => t.title !== req.params.id);

    fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.json({ message: "Transaction deleted" });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
