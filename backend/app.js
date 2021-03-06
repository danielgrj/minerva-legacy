require('dotenv').config();

const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const collectionsRoutes = require('./routes/collections');
const notesRoutes = require('./routes/notes');
const quotesRoutes = require('./routes/quotes');
const referencesRoutes = require('./routes/references');
const stylesRoutes = require('./routes/styles');

const { isLoggedIn } = require('./middleware');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN
  })
);

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(res => {
    console.log(`Connected to Mongo! Database name: "${res.connections[0].name}"`);
  })
  .catch(err => console.error('Error connecting to mongo', err));

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    secret: process.env.SECRET
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/collections', isLoggedIn, collectionsRoutes);
app.use('/api/notes', isLoggedIn, notesRoutes);
app.use('/api/quotes', isLoggedIn, quotesRoutes);
app.use('/api/references', isLoggedIn, referencesRoutes);
app.use('/api/styles', isLoggedIn, stylesRoutes);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const { loginSocket } = require('./middleware');

io.use(loginSocket);

const { updateQuote } = require('./controllers/quotes.controller');

io.on('connection', client => {
  client.on('editQuote', updateQuote(client));
});

server.listen(process.env.PORT, () => {
  console.log(`Server is up on http://localhost:${process.env.PORT}/`);
});
