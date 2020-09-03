
# OTM Backend

## Running application

To run the appliction build the docker containers:

```
docker-compose up
```

Wait until you see message similar to:

```
otm_backend_web      | [Nest] 29   - 09/02/2020, 5:12:43 PM   [NestApplication] Nest application successfully started +4ms
```

Then backend application will be available on port 3001. You can test it be going to url. `http://localhost:3001/todo-lists/all`. You should see json response with 3 lists.

Socket io server will be available on port 3004: `http://localhost:3004/test`

## Tests

To run tests you need to install app on your local machine with: 

```
npm install
```

Then test can be run by:

```
npm run test
```
