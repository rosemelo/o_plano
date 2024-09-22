const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use('/public', express.static('public'));

// Ensure the drawings directory exists
const drawingsDir = path.join(__dirname, '../public/drawings');
if (!fs.existsSync(drawingsDir)){
    fs.mkdirSync(drawingsDir, { recursive: true });
}

app.post('/save-drawing', (req, res) => {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(drawingsDir, 'drawing_' + Date.now() + '.png');

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving drawing:', err);
            return res.status(500).send('Erro ao salvar o desenho. Tente novamente mais tarde.');
        }
        res.send('Desenho salvo com sucesso.');
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
