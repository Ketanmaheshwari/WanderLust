// Exporting a higher-order function that takes an async function `fn` as input
module.exports = (fn) => {
    // Returning a new middleware function that Express can use
    return (req, res, next) => {
        // Execute the async function and automatically catch any errors
        // `Promise.resolve()` ensures the result of `fn()` is treated as a promise
        Promise.resolve(fn(req, res, next)).catch(next);
        // If an error occurs, it is passed to Express's error handler via `next(err)`
    };
};
