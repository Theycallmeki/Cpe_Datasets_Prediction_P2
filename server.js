const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = 3000;

// Path to the CSV file
const filePath = path.join(__dirname, 'grocery_sales.csv');

// Object to store detailed sales data by month
const salesByMonth = {};

// Parse the CSV
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const month = row.Month;
    const item = row.Item;
    const quantity = parseInt(row['Quantity Sold']);
    const price = parseFloat(row.Price);

    if (!salesByMonth[month]) {
      salesByMonth[month] = [];
    }

    salesByMonth[month].push({
      item,
      quantity,
      price,
      total: quantity * price
    });
  })
  .on('end', () => {
    console.log('CSV file processed with detailed sales data.');
  });

// Serve static files from the "screen" folder
app.use(express.static(path.join(__dirname, 'screen')));

// API endpoint
app.get('/data', (req, res) => {
  res.json(salesByMonth);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
