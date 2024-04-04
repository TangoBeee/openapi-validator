const express = require('express');
const cors = require("cors");
const SwaggerParser = require("@apidevtools/swagger-parser");
const yaml = require('js-yaml');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/openapi-validator', async (req, res) => {
  try {
    const { schema } = req.body;
    if (!schema) {
      return res.status(400).send(false);
    }

    const schemaObject = handleParse(schema);

    if(!schemaObject) return res.status(400).send(false);

    const api = await SwaggerParser.validate(schemaObject);
    res.status(200).send(true);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

const handleParse = (value) => {
    try {
      const parsedData = JSON.parse(value);
      return parsedData;
    } catch (jsonError) {
      try {
        const parsedData = yaml.load(value);
        return parsedData;
      } catch (yamlError) {
        return null;
      }
    }
};

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

