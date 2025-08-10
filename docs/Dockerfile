# Build a tiny Node server to serve Swagger UI
FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN npm init -y && npm install express swagger-ui-express js-yaml

# Copy OpenAPI spec from project root (build context is now ".")
COPY openapi.yaml /app/openapi.yaml

# Create server
COPY <<'EOF' /app/server.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const port = process.env.PORT || 8080;

const spec = yaml.load(fs.readFileSync('/app/openapi.yaml', 'utf8'));

app.use('/', swaggerUi.serve, swaggerUi.setup(spec));

app.listen(port, () => {
  console.log(`Docs server running on ${port}`);
});
EOF

EXPOSE 8080
CMD ["node", "server.js"]