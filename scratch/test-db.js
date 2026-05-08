'use strict';
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log('Attempting to connect to:', uri.replace(/:([^:@]{1,})@/, ':****@'));

mongoose.connect(uri, { family: 4 })
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:');
    console.error(err);
    process.exit(1);
  });
