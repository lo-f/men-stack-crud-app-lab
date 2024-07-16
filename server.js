const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log (`Connected to MongoDB ${mongoose.connection.name}.`)
})

/* ------------------------------- MIDDLEWARE ------------------------------- */
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, "public")));

const Stadium = require('./models/stadium.js');

app.listen(3000, () => {
    console.log(`Listening on PORT 3000`)
});


/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- HOME ---------------------------------- */
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

/* ----------------------------------- NEW ---------------------------------- */
app.get('/stadiums/new', (req, res) => {
    res.render('stadiums/new.ejs')
})

app.post('/stadiums', async (req, res) => {
    if (req.body.isIndoor === 'on') {
        req.body.isIndoor = true;
    } else {
        req.body.isIndoor = false;
    }
    await Stadium.create(req.body);
    res.redirect('/stadiums/index')
})

/* ---------------------------------- INDEX --------------------------------- */
app.get('/stadiums/index', async (req, res) => {
    const allStadiums = await Stadium.find();
    res.render('stadiums/index.ejs', { stadiums: allStadiums })
})

/* ---------------------------------- SHOW ---------------------------------- */
app.get('/stadiums/:stadiumId', async (req, res) => {
    const foundStadium = await Stadium.findById(req.params.stadiumId)
    res.render('stadiums/show.ejs', { stadium: foundStadium});
})

/* --------------------------------- DELETE --------------------------------- */
app.delete("/stadiums/:stadiumId", async (req, res) => {
    await Stadium.findByIdAndDelete(req.params.stadiumId);
    res.redirect('/stadiums/index')
  });

/* ---------------------------------- EDIT ---------------------------------- */
app.get("/stadiums/:stadiumId/edit", async (req, res) => {
    const foundStadium = await Stadium.findById(req.params.stadiumId)
    res.render('stadiums/edit.ejs', { stadium: foundStadium});
})

/* --------------------------------- UPDATE --------------------------------- */   
app.put("/stadiums/:stadiumId", async (req, res) => {
    if (req.body.isIndoor === "on") {
        req.body.isIndoor = true;
    } else {
        req.body.isIndoor = false;
    }
    
    await Stadium.findByIdAndUpdate(req.params.stadiumId, req.body)
    res.redirect(`/stadiums/${req.params.stadiumId}`)
})