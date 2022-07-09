const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    // Get the authentication token from the `authorization header`
    const token = await request.headers.authorization.split(" ")[1];
    // Check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
    // Retrieve the user details of the logged in user
    const user = await decodedToken;

    // Pass the use down to the endpoints here
    request.user = user;
    // Pass down functionality to the endpoint
    next();
  } catch (error) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
