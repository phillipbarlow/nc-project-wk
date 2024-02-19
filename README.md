# Northcoders News API

 In order to run this repository locally, you will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

 1. In order to run this Repository locally, you will need to create two .env files
 2. Name the files, in this case we will need to have-
 test-setup.sql & dev-setup.sql.
 3. For the test sql file add the following PGDATABASE = test-setup.sql.
 4. For the main sql file add the following PGDATABASE = nc_news;