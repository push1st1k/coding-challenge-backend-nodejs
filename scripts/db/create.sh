#!/bin/bash

USER="postgres"
PASSWD="passwd"

psql -U $USER -v user=$USER -v dbname="anti_theft" -f ./db.sql;
psql -U $USER -v user=$USER -v dbname="anti_theft_test" -f ./db.sql;