const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ipfsFolder = './ipfs';

app.get('/getfur/:filename', (req, res) => {
    const filename = req.params.filename;
    
    if (!filename) {
        return res.status(400).send("Missing filename parameter");
    }

    try {
        const jsonPath = path.join(ipfsFolder, filename);

        if (!fs.existsSync(jsonPath)) {
            return res.status(404).send("JSON file not found");
        }

        const jsonContent = fs.readFileSync(jsonPath, 'utf8'); // Read the JSON file as text
        const jsonData = JSON.parse(jsonContent); // Parse the JSON content

        const attributes = jsonData.attributes || [];
        const furAttribute = attributes.find(attr => attr.trait_type === "Fur");

        if (!furAttribute) {
            return res.status(404).send("Fur attribute not found");
        }

        const furValue = furAttribute.value;
        res.send(`"${furValue}"`);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
