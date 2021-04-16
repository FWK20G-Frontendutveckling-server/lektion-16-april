/**
 * Endpoints
 * 
 * URL: /api/login
 * Method: POST
 * 
 * URL: /api/signup
 * Method: POST
 */

/**
 * Vad är databasen till för? Vad är dess syftet?
 * Vi vill spara användarkonton och kunna validera användarnamn och lösenord
 * 
 * Vad vill vi spara för data?
 * Vi vill spara användarnamn, e-post och lösenord
 * 
 * Vad är det för typ av data vi vill spara?
 * Det är en array med data där varje konto är ett objekt
 * 
 * Ex:
 *   {
 *      accounts: [
*                  {
*                     username: 'Chris',
                      email: 'chris@chris.se',
                      password: 'pwd123'
*                  }
 *      ]
 *   }
 */

const lowdb = require('lowdb');
const express = require('express');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('accounts.json');
const database = lowdb(adapter);

const app = express();

app.use(express.json());

function initDatabase() {
  database.defaults({ accounts: [] }).write();
}

app.post('/api/login', (request, response) => {
  const loginCredentials = request.body;

  const compareCredentials = database.get('accounts')
                              .find({ username: loginCredentials.username, password: loginCredentials.password })
                              .value();
  console.log('compareCredentials:', compareCredentials);

  const result = {
    success: false
  }

  if (compareCredentials) {
    result.success = true;
  }

  response.json(result);
})


app.post('/api/signup', (request, response) => {
  const account = request.body;
  console.log('Konto att lägga till:', account);

  const userNameExists = database.get('accounts').find({ username: account.username }).value();
  const emailExists = database.get('accounts').find({ email: account.email }).value();

  console.log('userNameExists:', userNameExists);
  console.log('emailExists:', emailExists);

  const result = {
    success: false,
    userNameExists: false,
    emailExists: false
  }

  if (userNameExists) {
    result.userNameExists = true;
  }

  if (emailExists) {
    result.emailExists = true;
  }

  if (!result.userNameExists && !result.emailExists) {
    database.get('accounts').push(account).write();
    result.success = true;
  }

  response.json(result);

});

app.listen(8000, () => {
  console.log('Server started');
  initDatabase();
});