class ExpressError extends Error { //Error handling on the site. 
    constructor(message, statusCode) {
        super();
        this.message = message; 
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError; //This allows this function to be used in other files by importing it. 