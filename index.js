const app = require('./app');
const { connectDatabase } = require('./config/database');
const port = process.env.PORT || 3000;

connectDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server has started and App is listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
