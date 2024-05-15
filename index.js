const express = require('express');
const CC = require('currency-converter-lt');
const app = express();
const { google } = require('googleapis');
const bodyParser = require('body-parser');


app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;


const service_account_config = {
  "type": "service_account_config",
  "project_id": "push-notification-55b39",
  "private_key_id": "25ebd4df661079cbfe345883ae470f0a3f9b0f88",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6QCRYn6wHf+oV\ntlSGtubSj5uuFvKJzDlOFUCLymOxIb26vIn+0OHJ/XAclKBr4/0cxUn3bRiJe4kn\nYVG7pjls/Lhz8UNTxCF5t32DuwjnSHAErV9FXcpeB2c9xMR24wvOi4RLh8p4N/Ga\nYubI/spvOLFcV+kLEPGh/m6HVObvpadem9aeThP1fsGAXq+qrpLBk67+a+fdrc3T\nB50Cx9R1ots5+dPPcZKWlrAhUrzt7CxdGmTAntO8Uk4fH10b8Po4LvZaPHycNky0\nuG3e6kfy24Meq7jSoVEBF/FRL4kjXsi+sDF+JPdLLVp8qclOdEXjLbTWD5M/rPLG\ndJo2L+N7AgMBAAECggEAT8BQb+xrLsjslMB+oDKoUugwStLDpxKeRRufiFww5POk\nONYrpsONsz7E51ATAy/cPZoTCpIZ7CDMQWMQKvBJ7aunVeosoK0+gk56PdJ0RQjF\nApO0VFENasbzw8TCNYASGa6vBuKN5X1bBHcuCEnlp8tYUsjH3reyJ+H5NRS7UEjc\n9pYxJdQ7whg+/v9PqxsZxr+v1amajUpUJ/Dkpmt+O0bdO29ctfoGcn3ttHc6DtHt\nugiu5LIhntemmP7Z3+OacV6kH7uB7nZrgzjUHdrkyiqGzB3KTMe08jGwNZHx4fm6\nboAhetDRoBB7In1ABCNe2TI8Z2H0gVbB6MVLNzxm9QKBgQDgsK5S05/hDmQX7a8X\nPWpMFDRrtL/K1eeh/gT+aKYCfX7c43ENo3Mt9OTR8CXq2OGHCY2CNkxCc6aIN3LE\n7govYU2IB/9qchH37VUqbXlezATfpy5TxMsi2E9BUu3HI3ky34xDtaA2KIoSjnkb\nclt24MCdFeuoPWBu9cIKjZTFRwKBgQDUNDbMWOfiVslHoIpJl0qlCFZgdCpbjpG1\nT2bXzm9DpGnZU0kqiycihU+wmnewUJo7wt5O9AGjlEtDHnbguUeeulE6J8ksN/7r\niAY71VK6R6BYqmIn3mwjbExcyNkKh1nl6QrQllQU97AqKNEhTScsEBhuOLovTBtJ\npAzXkQAaLQKBgGCnoFXA82W86xHgDRHSOYfAqUwr1NVMbvggbcWC/ubTVV9v95IG\nXeXHEye8RpNf+KQ+V8FL2kI7vcebEqPkQj1ffhqmVhlUOKaOUbSOo0dEPFR5dlRS\ns4+pvW48Xkzr1Zcs0wnNd73UcpDI+Q/1gaMBy9nHNDiLLpCM54vim7zBAoGAFLM3\nOT3e+ORQZC1T8BPTE0A59NTAIQhKTG5/cMPRdL7AGJQYSg8i9Sod+PNIg6mJMhUz\nTG5fDo7zvItnO0q3otM4Az1IUYjw1BcDzKhllohQKvYL9ymqUNZKqK5rBazoZxYR\nmQFhGF6FD8fFhsMY9CJpz6628tAwxUE8g3bAlM0CgYEAj6Ba/vCWBzFgCfdmwL3f\nN485ZBkmWXEaQnSyRdvcJ7k/nnqsBVpBcMgL/fOipfO9eXsSpyUhhznFpwaJXrwx\nBa2BZkUzahFsZrC51wt550QeFuMxzlks9nzzZaEUDaDWqvaStqYO/atEqPo0nQ2g\nVKKslkKCBVJdKJzzcomfQJM=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-unfjo@push-notification-55b39.iam.gserviceaccount.com",
  "client_id": "112633510150540040254",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-unfjo%40push-notification-55b39.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

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

async function getAccessToken() {
  const key = service_account_config;
  console.log('key', key)
  try {
    const accessToken = await new Promise((resolve, reject) => {
      const jwtClient = new google.auth.JWT(
        key.client_email,
        undefined,
        key.private_key,
        ["https://www.googleapis.com/auth/firebase.messaging"],
        undefined
      );
      jwtClient.authorize((err, tokens) => {
        if (err) {
          console.error("Error authorizing JWT client:", err);
          reject(err);
        } else if (!tokens || !tokens.access_token) {
          console.error("Failed to obtain access token:", tokens);
          reject(new Error("Failed to obtain access token."));
        } else {
          resolve(tokens.access_token);
        }
      });
    });

    return accessToken;
  } catch (error) {
    // Handle any errors here
    console.error("Error in getAccessToken:", error);
    throw error; // Rethrow the error to the caller
  }
}


app.post('/send-notification', async (req, res) => {
  const { title, body, registrationToken } = req.body;

  // Check if all required fields are provided
  if (!title || !body || !registrationToken) {
    return res.status(400).json({ error: 'Missing parameters. Please provide "title", "body", and "registrationToken".' });
  }
  const payload = JSON.stringify({
    message: {
      token: registrationToken,
      notification: { title, body }
    }
  });
  console.log('payload', payload);
  const serverToken = await getAccessToken();

  const result = await fetch("https://fcm.googleapis.com/v1/projects/push-notification-55b39/messages:send", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${serverToken}`
    },
    body: payload
  });

  const response = await result.json();
  console.log({ response });


  // For demonstration purposes, just sending a success message
  return res.json({ message: 'Notification sent successfully', title, body, registrationToken });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  setInterval(async () => {
    await fetch('http://localhost:3000/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "body":"Please do your study Mrug, don't forget your promise",
        "title":"Study time Mrug",
        "registrationToken": "f_yUhwW752JWo5INtGjZ4E:APA91bFMlNuVH_vEqE6ISCdF68EhFyR5kdm7lPDwpkS4_SH8neSIpcOmq-FlfEh_dviAmv0dG0A5J-TZuYPPQlRTNEUnOZF3BtKR9R9ab58iRYgAaw1uz-Sd3mO2mRfgmL28I5YIsk7o"
      })
    });
  }, 1000 * 60);
});


