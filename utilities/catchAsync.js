module.exports = func => { //This is a function that accepts a function (func) as its argument then passes on that function. 
    return (req, res, next) => { //It also returns a function which is what this is. 
        func(req, res, next).catch(next); //Catches any errors & passes them to next. 
    }
}

//This is what manages the asynchronous function error handling. The .catch(next) is what allows the programme to keep running even when an error occurs, it gives the programme something to do so the error doesn't crash it. 