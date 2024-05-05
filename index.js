const express = require('express');
const CC = require('currency-converter-lt');
const app = express();
const PORT = process.env.PORT || 3000;

// Set headers to allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});

// Greeting home page
app.get('/', (req, res) => {
  res.send('Welcome to Currency Converter API');
});

// Currency converter API
app.get('/convert', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters. Please provide "from", "to", and "amount".' });
  }

  try {
    let currencyConverter = new CC({ from: from, to: to, amount: +amount });

    const result = await currencyConverter.convert();
    res.json({ result, from, to, amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
