const express = require('express');
const router = express.Router();
const db = require('../Database/database');
const slug = require('slug');
const upload = require('../Database/filestorage');
const showdown = require('showdown');
const converter = new showdown.Converter();

// > Handle incoming GET requests to /societies
router.get('/', (req, res, next) => {
    db.promise().query("SELECT uuid, name, description, logo, nameSlug FROM societies")
        .then((results) => {
            res.status(200).json(results[0]);
        })
        .catch((err) => {
            console.log(err.stack);
            res.status(500).json({
                error: err
            })
        });
});

// > Handle incoming GET requests to /societies/{society name}
router.get('/:socName', (req, res, next) => {
    const societyName = req.params.socName;
    console.log(societyName);

    db.promise().query("SELECT name, description, logo FROM societies WHERE nameSlug=?", [societyName])
        .then((results) => {
            res.status(200).json(results[0]);
        })
        .catch((err) => {
            console.log(err.stack);
            res.status(500).json({
                error: err
            })
        });
});

// > Handle incoming PATCH requests to /societies/{society name}
// > This is how you update a societies information
router.patch('/:socName', (req, res, next) => {
    // > Check to see we aren't posting the same image
    // > Update values
    // > ETC

    res.status(200).json({
        message: 'Updating society'
    });
});

// > Handle incoming POST requests to /societies/new
router.post('/new', upload.single('logo'), (req, res, next) => {
    var imageName = "";
    if (req.file) {
            imageName = req.file.location;
    } else {
        imageName = "Temporary Logo";
    }

    const data = {
        name: req.body.name,
        description: req.body.description,
        logo: imageName,
        nameSlug: slug(req.body.name, {lower: true}) // > Will convert LA1TV to la1tv and Bailrigg FM to bailriggfm
    }

    db.promise().query(`INSERT INTO societies (name, description, logo, nameSlug) values (?, ?, ?, ?)`, [data.name, converter.makeMarkdown(data.description), data.logo, data.nameSlug])
        .then(([rows, fields]) => {
            console.log(rows);
            res.status(200).json({
                message: "Organisation created"
            });
        })
        .catch((err) => {
            console.log(err.stack);
            res.status(500).json({
                error: err
            })
        });
});

// > Handle incoming DELETE requests to /societies
router.delete('/:socName', (req, res, next) => {
    const societyName = req.params.socName;
    console.log(societyName);

    db.promise().query("DELETE FROM societies WHERE nameSlug=?", [societyName])
        .then((results) => {
            res.status(200).json(results[0]);
        })
        .catch((err) => {
            console.log(err.stack);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;