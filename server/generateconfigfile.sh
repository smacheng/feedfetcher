#!/usr/bin/env bash
set -ev
printf "module.exports = {\n'port': process.env.PORT || 8999,\n'database': 'mongodb://localhost:27017/feedfetcher',\n'feedfetcherSecret' : 'extremelyawesometokensecret',\n'email' : 'fisher@mphfish.com',\n'password' : 'likeatotallycompletelysuperubersecurepasswordthatnobodycancrackunlessmaybetheyhaveagibsonwaitisntthatakindofguitar?',\n'admin' : true,\n'testuseremail' : 'test@mphfish.com',\n'testuserpassword' : 'test',\n'env': 'dev'\n};" > appconfig.js