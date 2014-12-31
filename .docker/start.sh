#!bin/sh
service mongodb start &&
forever /code/server.js
