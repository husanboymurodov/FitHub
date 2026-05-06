const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server has started and App is listening on port ${port}`);
});
