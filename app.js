const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (_req, res) => res.render('sudoku'));

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server listening on port:', process.env.PORT || 3000);
});