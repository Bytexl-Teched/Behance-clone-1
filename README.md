# Behance-clone-1
Behance Clone created with Mongo DB for ByteXL Students. The codes are well commented to make it easier for students to learn from.
## Some deliberate Code Choices we have made as part of the project:
Here are the choices we have made. The numerous list of choices can seem confusing if you are early in your journey as a full stack developer. If you are uncomfortable with full stack web development, our suggestion is to ignore the details below. Come back here after building a few apps to understand our choices."

1. Frontend is built with React instead of Angular, Svelte etc. 
2. We have used the Vite bundler for bundling the app instead of Parcel, Webpack etc.  
3. Exclusively client-side rendering, no server-side rendering. React docs themselves recommend going with a framework Next, Remix, Gatsby for production grade apps instead of bundling with Vite etc for production grade apps.
4. MUI is the CSS framework instead of Tailwind, Bootstrap, Chakra etc.
5. React Router for frontend routing instead of Wouter etc.
6. Middleware is built with Express/Node instead of Django, Flask, PHP, SpringBoot etc.
7. A No-SQL database - MongoDB - is used instead of a relational database like PostGres, MySQL etc.
8. Mongoose is used as the ODM to communicate with MongoDB instead of writing native MongoDB queries.
9. No authorization based actions on any API route
10. JWT token is only used to identify the user
11. Cookies are not used
12. Token returned from backend stored in localStorage for simplicity

    # Happy Learning
