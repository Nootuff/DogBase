module.exports = func => { //This is a function that accepts a function (func) as its argument then passes that function 
    return (req, res, next) => { //I think it's also returning a function which is what this is. 
        func(req, res, next).catch(next); //Catches any errors & passes them to next. 
    }
}

//This is what does the asynchronous function error handling. The .catch(next) is what allows the programme to keep running even when an error occurs. 