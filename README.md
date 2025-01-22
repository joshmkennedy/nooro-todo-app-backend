# Nooro Todo App

## Backend

After pulling down the repo

### Install dependencies
`npm run install`

### Setup Db
1. create mysql db
- `mysql -u root -p -e "create database noroo_todos";`

2. set up prisma
- `npx prisma migrate dev --name init`

3. generate command
- `npx prisma generate`

4. make sure mysql is running on port 3306. Adjust the DATABASE_URL env var in
   the .env file
   - if there is not an env file create on by running

```bash
echo "DATABASE_URL=\"mysql://root:root@localhost:3306/nooro_todos\"\
PORT=3100
```

### Port availability
make sure port 3100 is availabile

### Run start command
`npm run start`



