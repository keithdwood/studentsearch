var express = require('express');
var students = require('./data/students_classes.json');
var app = express();
var lodash = require('lodash');
var port = process.env.PORT || 3000;

var studentService = studentService();
var gpaCalculator = gpaCalculator();
var classService = classService(students.classes);

app.use(express.static('../client'));

var server = app.listen(port, function () {

    function createStudentDetailResponse(student){
        console.log("Building details: " + student.first);
        var studentClasses = lodash.transform(student.studentClasses, function(result, classRecord){
            result.push({
                name: classService.getClassNameById(classRecord.id),
                grade: classRecord.grade
            })
        });

        return {
            first: student.first,
            last: student.last,
            email: student.email,
            gpa: gpaCalculator.calculateStudentGpa(student),
            classes: studentClasses
        }
    };

    console.log('Example app listening on port: %s', port);

    app.get('/api/student', function(req, res){
        var firstName = req.query['first'];
        var lastName = req.query['last'];

        var firstMatch = lodash.isUndefined(firstName) ? students.students : studentService.filterFirstName(students.students, firstName);
        console.log(firstMatch);
        console.log("Last name is: " + lastName);
        var lastMatch = lodash.isUndefined(lastName) ? firstMatch : studentService.filterLastName(firstMatch, lastName);
        console.log(lastMatch);

        var searchResults = lodash.transform(lastMatch, function(result, studentRecord){
           result.push({
               first: studentRecord.first,
               last: studentRecord.last,
               email: studentRecord.email,
               gpa: gpaCalculator.calculateStudentGpa(studentRecord)
           });
        });
        res.json(searchResults);
    });

    app.get('/api/student/:studentId', function(req, res){

        var studentId = req.params['studentId'];
        if(lodash.isUndefined(studentId)){
            res.status(400).send('Missing student id');
        }
        var studentRecord = studentService.getById(students.students, studentId);
        if(lodash.isUndefined(studentRecord)){
            console.log("No student record for: ", studentId);
            res.json("{}").send();
        }
        else {
            res.json(createStudentDetailResponse(studentRecord));
        }
    });

});

function studentService(){

    function filterFirstName(students, firstName){
        console.log("Looking for first: " + firstName)
        return lodash.filter(students, function(student){
            console.log("Checking " + student.first);
            console.log(Boolean(student.first.match(firstName)));
            return student.first.match(firstName);
        })
    }

    function filterLastName(students, lastName){
        console.log("Looking for last: " + lastName);
        return lodash.filter(students, function(student){
            console.log("Checking " + student.last);
            console.log(Boolean(student.last.match(lastName)));
            return student.last.match(lastName);
        })
    }

    function getByEmail(students, emailAddress){
        console.log("Getting for email address.");
        return lodash.filter(students, function(student){
            return student.email.match(emailAddress);
        })[0];
    }

    return {
        filterFirstName: filterFirstName,
        filterLastName: filterLastName,
        getById: getByEmail
    }
};

function classService(classes){

    function getClassNameById(id){
        return classes[id];
    }

    return {
        getClassNameById: getClassNameById
    }
}

function gpaCalculator(){

    function calculateStudentGpa(student){
        console.log("Calculating gpa for " + student.last);
        if (student.studentClasses !== null) {
            var totalGradePoints = lodash.reduce(student.studentClasses, function (total, classItem) {
                if (isNaN(total)){
                    total = parseFloat(classItem.grade);
                }
                console.log("Total: " + total);
                return total + Math.round(100*parseFloat(classItem.grade))/100;
            });
            console.log("Total points: " + totalGradePoints + " for " + student.studentClasses.length + " classes.");
            return Math.round(100*(totalGradePoints/student.studentClasses.length))/100;
        }
        return 0;
    }

    return {
        calculateStudentGpa: calculateStudentGpa
    }
};

