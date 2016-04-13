var express = require('express');
var router = express.Router();
var dataAccess = require('../data-access');
var winston = require('winston');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',function(req,res){
    dataAccess(req,"login",function(response){
        if(response === null) {
            res.json({"error" : "true","message" : "Database error occured"});
        } else {
            if(!response) {
                res.json({
                    "error" : "true",
                    "message" : "Login failed ! Please register"
                });
            } else {
                req.session.key = response;
                res.json({"error" : false,"message" : "Login success."});
            }
        }
    });
});

router.get('/home',function(req,res){
    if(req.session.key) {
        res.render("home.ejs",{ email : req.session.key["user_name"]});
    } else {
        res.redirect("/");
    }
});

router.get("/fetchStatus",function(req,res){
    if(req.session.key) {
        dataAccess(req,"getStatus",function(response){
            if(!response) {
                res.json({"error" : false, "message" : "There is no status to show."});
            } else {
                res.json({"error" : false, "message" : response});
            }
        });
    } else {
        res.json({"error" : true, "message" : "Please login first."});
    }
});

router.post("/addStatus",function(req,res){
    if(req.session.key) {
        dataAccess(req,"addStatus",function(response){
            if(!response) {
                res.json({"error" : false, "message" : "Status is added."});
            } else {
                res.json({"error" : false, "message" : "Error while adding Status"});
            }
        });
    } else {
        res.json({"error" : true, "message" : "Please login first."});
    }
});

router.post("/register",function(req,res){
    dataAccess(req,"checkEmail",function(response){
        if(response === null) {
            res.json({"error" : true, "message" : "This email is already present"});
        } else {
            dataAccess(req,"register",function(response){
                if(response === null) {
                    res.json({"error" : true , "message" : "Error while adding user."});
                } else {
                    res.json({"error" : false, "message" : "Registered successfully."});
                }
            });
        }
    });
});

router.get('/logout',function(req,res){
    if(req.session.key) {
        req.session.destroy(function(){
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
