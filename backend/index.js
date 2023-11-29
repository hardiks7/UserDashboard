const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 4500
const secretKey = "secretKey"
const jwt = require('jsonwebtoken')
const database = require('./database.js')
var cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4 : uuidv4 } = require('uuid')
const { count, error } = require('console')

app.use(bodyParser.json())
app.use(cors())

app.use(function (req, resp, next) {
    resp.setHeader('Accese-Control-Allow-Origin', 'http://localhost:5173');
    resp.setHeader('Accese-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    resp.setHeader('Accese-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});



// userdata-screen

app.post('/user', (req, resp, next) => {
    const userId = uuidv4();
    req.userId = userId;
    next();
});

const storage = multer.diskStorage({
    destination : (req, file, cb) =>{
        if(!req.userId) {
            return cb(new Error ('User Id not provided'),null)
        }
        const userFolder = `./upload/${req.userId}`;
        const profilePicFolder = path.join(userFolder, 'profilepic');
        const resumeFolder = path.join(userFolder, 'resume');

        fs.mkdirSync(userFolder, {recursive: true});
        fs.mkdirSync(profilePicFolder, {recursive: true});
        fs.mkdirSync(resumeFolder, { recursive: true});

        if (file.fieldname === 'profilepicture'){
            cb(null, profilePicFolder)
        } else if (file.fieldname === 'resume'){
            cb(null, resumeFolder);
        } else {
            cb(new Error('Invalid File field'), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage: storage});
app.use('/upload', express.static('upload'));

app.post('/user', upload.fields([
    {name: 'profilepicture', maxCount: 1 },
    {name: 'resume', maxCount: 1 },
]), (req, resp) => {
    const profilepicture = `http://localhost:4500/upload/${req.userId}/profilepic/${req.files['profilepicture'][0].filename}`;
    const resume = `${req.files['resume'][0].filename}`;
    database.CreateUser(req.userId,req.body,profilepicture,resume)
    .then((response) => {
        resp.status(200).send(response);
    })
    .catch((error) => {
        resp.status(500).send(error);
    })
});

app.get('/UserPagination', (req, res) => {
    const sortOrder = req.query.sortOrder || 'asc';
    const filter = req.query.filter || '';
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize);
    database.UserPagination(pageNumber, pageSize, filter, sortOrder)
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            res.status(200).send(error)
        })
})



















// ----------------------------------------------------

app.get('/country', (req, resp) => {
    database.getcountry()
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

app.get('/state', (req, resp) => {
    database.getstate()
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

app.get('/city', (req, resp) => {
    database.getcity()
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})


app.post('/country', (req, resp) => {
    database.createcountry(req.body)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

app.post('/state', (req, resp) => {
    database.createstate(req.body)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

app.post('/city', (req, resp) => {
    database.createcity(req.body)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

//Country .. 

app.get('/country/:countryid', (req, resp) => {
    const countryid = req.params.countryid
    database.getcountryById(countryid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})


app.put('/country/:countryid', (req, resp) => {
    const body = req.body
    const countryid = req.params.countryid
    database.updatecountry(body, countryid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})


app.delete('/country/:countryid', (req, resp) => {
    const countryid = req.params.countryid
    database.deletecountry(countryid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

// State ..

app.get('/state/:stateid', (req, resp) => {
    const stateid = req.params.stateid
    database.getstateById(stateid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

app.put('/state/:stateid', (req, resp) => {
    const body = req.body
    const stateid = req.params.stateid
    database.updatestate(body, stateid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

app.delete('/state/:stateid', (req, resp) => {
    const stateid = req.params.stateid
    database.deletestate(stateid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})

// City ..

app.get('/city/:cityid', (req, resp) => {
    const cityid = req.params.cityid
    database.getcityById(cityid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})


app.put('/city/:cityid', (req, resp) => {
    const body = req.body
    const cityid = req.params.cityid
    database.updatecity(body, cityid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})


app.delete('/city/:cityid', (req, resp) => {
    const cityid = req.params.cityid
    database.deletecity(cityid)
        .then(res => {
            resp.status(200).send(res);
        })
        .catch(err => {
            resp.status(500).send(err);
        })
})


// Pagination ..


app.get('/countryPagination', (req, res) => {
    const sortOrder = req.query.sortOrder || 'asc';
    const filter = req.query.filter || '';
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize);
    database.CountryPagination(pageNumber, pageSize, filter, sortOrder)
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            res.status(200).send(error)
        })
})


app.get('/statePagination', (req, res) => {
    const sortOrder = req.query.sortOrder || 'asc';
    const filter = req.query.filter || '';
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize);
    database.StatePagination(pageNumber, pageSize, filter, sortOrder)
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            res.status(200).send(error)
        })
})


app.get('/cityPagination', (req, res) => {
    const sortOrder = req.query.sortOrder || 'asc';
    const filter = req.query.filter || '';
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize);
    database.CityPagination(pageNumber, pageSize, filter, sortOrder)
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            res.status(200).send(error)
        })
})


// user-sreen ..

app.post('/admin', (req, res) => { 
    const { username, password } = req.body;

    database.CreateToken({ username, password })
        .then((user) => {
            if (user) {
                jwt.sign({ username, password }, secretKey, { expiresIn: '1h' }, (err, token) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server error' });
                    } else {
                        res.json({ token });
                    }
                });
            } else {
                res.status(401).json({ error: 'Invalid usarename & password' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Invalid server error', error });
        })
})

app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.send({ result: "invalid Token" })
        } else {
            res.json({ message: "profile accessed", authData })
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.send({ result: "Tokan is not valid" })
    }
}








app.listen(port, () => {
    console.log(`App running on port ${port}`)
})













