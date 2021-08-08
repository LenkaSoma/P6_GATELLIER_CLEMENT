const http  = require('http');
const app   = require('./app');
const port  = (process.env.PORT || '3000'); // Si process.env.PORT n'existe pas on utilise le port 3000

app.set('port', port); 

const server = http.createServer(app);
server.listen(port);