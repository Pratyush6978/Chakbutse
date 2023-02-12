const express = require('express');
const app = express();
const port = 5000;
app.listen(process.env.PORT || port, () => console.log('Server online!'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false}));
const Datastore = require('nedb');


const db = new Datastore('database.db');
db.loadDatabase();

app.get('/login', (req, res) => {
    res.sendFile( __dirname+ '/admin/login.html');
});

app.post('/login', (req, res) => {
    const password = req.body.password;
    if (password == "donteventry"){
        res.sendFile(__dirname + "/admin/admin.html");
    }
    else{
        res.sendFile( __dirname+ '/admin/login.html');
    }
});

app.post('/sendHomework', (req, res) => {
    function getDay(date){
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[date.getUTCDay()];
    }
    const subjectDate = req.body;
    const convertIntoDay = getDay(new Date(subjectDate.date));
    const day = {day: convertIntoDay};
    const data = Object.assign({}, subjectDate, day);
    db.insert(data);
});

app.get("/getHomework", (req, res) => {
    db.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    });
});

app.delete("/getHomework/:id", (req, res) => {
    db.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
        if (err) {
            res.end();
            return;
        }
        res.end();
    });
});