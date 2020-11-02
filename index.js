const app = require('./src/app');

const APP_PORT = process.env.PORT || 3000;

app.listen(APP_PORT, () => {
    console.log(`Now serving your express app at hhtp://localhost:${APP_PORT}`)
})