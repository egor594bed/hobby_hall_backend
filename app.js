const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path')

const app = express();

app.use(express.json({extended: true}))

app.use('/api/auth', require("./routes/auth.routes"));
app.use('/api/catalog', require("./routes/catalog.routes"));
app.use('/api/order', require("./routes/order.routes"));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.port || 5000;

async function start() {
    try {
        await mongoose.connect(config.mongoUri)
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}



start();

                