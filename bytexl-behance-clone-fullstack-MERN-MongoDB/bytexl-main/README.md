# Steps to import data into MongoDB

Launch MongoDB Compass from your applications.
Connect to Your MongoDB Instance:

1. Click on the "+" icon to create a new connection.
2. Enter your MongoDB URI obtained from MongoDB atlas cloud platform and click on the connect button.
3. Create a database and collection by clicking the "create database" button on top-right corner.
4. Click on the newly created collection and click on the "add data" button.
5. Click on "import JSON or CSV file, it will open the file explorer from which you can select your mock JSON file.

# Steps to implement authentication using JWT

JWT (JSON Web Token) is a way to securely transmit information between a client and a server. When a user logs in, the server generates a token with user data (like their ID) and signs it using a secret key. The token is sent back to the client, typically stored in localStorage.

For every future request to protected routes, the client sends this token in the request headers. The server verifies the token using the secret key—if it's valid and not expired, the request is allowed; otherwise, it’s rejected. This helps maintain user sessions without storing sensitive data on the server.

## Steps for the signup route
1. Route Definition: The code sets up an endpoint for user signup.
2. Request Handling: It extracts user details from the request.
3. User Existence Check: It checks if the email is already registered.
4. Password Hashing: The password is hashed for security before saving it.
5. User Creation: A new user is created in the database.
6. Token Generation: A JWT is generated for the new user, which can be used for future authentication.
7. Response Handling: The server responds with success or error messages based on the outcome of the signup process.

## Steps for the login route
1. Route Definition: This sets up an endpoint for user login.
2. Request Handling: It extracts the user's email and password from the request body.
3. User Lookup: The code searches for a user in the database using the provided email.
4. Invalid User Check: If the user is not found, it responds with a 400 status indicating invalid email or password.
5. Password Verification: It checks if the provided password matches the hashed password stored in the database.
6. Invalid Password Check: If the password does not match, it responds with a 400 status indicating invalid email or password.
7. Token Generation: A JWT token is created for the authenticated user, which can be used for subsequent requests.
8. Response Handling: The server responds with a success message and the generated token or handles errors appropriately.

