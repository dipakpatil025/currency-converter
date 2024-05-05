const express = require('express');
const CC = require('currency-converter-lt')
const app = express();
const PORT = process.env.PORT || 3000;

// greeting home page
app.get('/', (req, res) => {
  res.send('Welcome to Currency Converter API');
});

// currency converter api base 3 digit country code

app.get('/convert', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters. Please provide "from", "to", and "amount".' });
  }

  try {
    let currencyConverter = new CC({ from: from, to: to, amount: +amount })

    const result = await currencyConverter.convert();
    res.json({ result, from, to, amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});