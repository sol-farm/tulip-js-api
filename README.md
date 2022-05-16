# solfarm-api

## How to run:

1. cp .env.example .env
2. Fill with proper variables
3. docker-compuse up
4. Go to http://localhost:PORT

Note: Make youre to have the CA certificate in /config/ folder and set .env CERT_PATH accordingly.

Example:

```
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAMESPACE=mongo_namespace.example.com
SERVER_PORT=3000
CERT_PATH="./config/ca-certificate.crt"
```