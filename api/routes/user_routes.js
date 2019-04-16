const express = require('express');
const router = express.Router();
const db = require('../Database/database');
const userSchema = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    userSchema
        .findAndCount({
            where: { 
                $or: {
                    username: req.body.username,
                    email: req.body.email
                }
            }
        })
        .then((result) => {
            console.log(result);
            if (result.count > 0) {
                res.status(500).json({
                    err: "Username or Email already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const newUser = {
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            creationDate: new Date()
                        };
            
                        userSchema
                            .create(newUser)
                            .then(() => {
                                res.status(200).json({
                                    message: 'Created User'
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({
                error: err
            });
        });
});

router.get('/login', (req, res, next) => {
    userSchema.findAll({
        where: {
            $or: {
                username: req.body.username,
                email: req.body.email
            }
        }
    })
    .then(user => {
        if (user.length < 1) {
            return res.status(404).json({
                message: 'Auth failed'
            });
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(404).json({
                    message: 'Auth failed'
                });
            }

            if (result) {
                const token = jwt.sign({
                    uniqueID: user[0].uniqueID
                },
                process.env.SECRET_WORD,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }

            res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({
            error: err
        });
    });
});

module.exports = router;