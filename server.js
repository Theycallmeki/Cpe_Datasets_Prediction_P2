const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = 3000;

// Path to the CSV file
const filePath = path.join(__dirname, 'grocery_sales.csv');

// Object to store data by month
const salesByMonth = {};

// Read and parse the CSV file
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const { month, item } = row;
    
    // Initialize month if not already in the object
    if (!salesByMonth[month]) {
      salesByMonth[month] = [];
    }

    // Add the item to the month
    salesByMonth[month].push(item);
  })
  .on('end', () => {
    console.log('CSV file processed and data is available for the HTML page.');
  });

// Serve static files from the 'screen' directory
app.use(express.static(path.join(__dirname, 'screen')));

// Define a route to get food sold by month
app.get('/data', (req, res) => {
  res.json(salesByMonth);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
