const app = require('./app');
const initDb = require('./config/initDb');

const PORT = process.env.PORT || 5000;

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
});