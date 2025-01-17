const express = require('express');
const apiRoute = require('./routes/api.js')
const authRoute = require('./routes/auth.js')
const migrateRoute = require('./routes/migrate.js')
const picturesRoute = require('./routes/imagesApi.js')
const reviewsRoute = require('./routes/reviews.js')
const cors = require('cors');

const insertLogs = require('./middlewares/logs.js')

require('dotenv').config();


const app = express();
const port = process.env.PORT;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(insertLogs)

// Use routes
app.use('/api',  apiRoute);
app.use('/auth', authRoute);
app.use('/migrate', migrateRoute);
app.use('/picture', picturesRoute);
app.use('/review', reviewsRoute);

app.get("/", (req, res) => {
    res.status(200).json({
        "status": 200,
        "message": "All ok"
    });
})

app.use((req, res, next) => {
    res.status(404).json({
        "statusCode": 404,
        "message": "Endpoint not found"
    });
})
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: err.stack,
    });
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});