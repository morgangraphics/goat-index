nvm use 8.6.0
npm install --only=dev

DEBUG=goat-index:* npm run dstart

DEBUG=goat-index:* npm run devstart

#Debugging via Chrome
node --inspect ./bin/www
