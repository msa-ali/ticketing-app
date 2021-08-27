import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
    res.send({name: 'altamash ali'});
})

app.listen(3000, () => {
    console.log('listening on port 3000!!');
});