const app = require('./app');
const pool = require('./config/db'); // Importing to ensure DB connects on startup

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});