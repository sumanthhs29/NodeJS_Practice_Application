const express = require('express');
const googleCalendarOperations = require('../helpers/googleCalendarOperations');
const route = express.Router();

route.get('/googlecalendar',(req,res) => {
    let obj={};
    obj.employeeName=req.header('employeeName');

    obj.employeeEmail=req.header('employeeEmail');

    obj.candidateName=req.header('candidateName');

    obj.candidateEmail=req.header('candidateEmail');

    obj.time=req.header('time');
    obj.time=obj.time+':00.000+05:30';
    console.log(obj);
    googleCalendarOperations.googleCalendarFunction(obj,res);
    let message = "Google calendar blocked successfully"
    res.send(message);
    
})

route.post('/sendInvite',(req,res) => {
    let calendarObject = req.params.username;
    console.log("he ",req.params);
    console.log(calendarObject);
    res.send("Hello");
    // googleCalendarOperations.googleCalendarFunction(res);
})

module.exports = route;