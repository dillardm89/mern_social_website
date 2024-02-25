# mern_social_website
Social website for sharing places using MERN

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHpya2U3d3VmenZ2NDJkMGRtbjFqZ2M2bHVmd3ZmdzlsM2V1NGFhcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qemgG2GcgC4R1u7sHZ/giphy.gif)

### Run Project:

- Set up MongoDB using json files in 'backend/database-files' (runs on localhost:27017)
- From 'frontend' directory: 'npm start' (runs on localhost:3000)
- From 'backend' directory: 'npm start' (runs on localhost:5000)

### Project Specifications:

- Create a social website for users to share places (image and location)
- Add website to GitHub to continue building portfolio

### Technical Requirements:

- This project will utilize MongoDB, Express, React, and Node (MERN stack)
- All code will be valid and follow best practices for naming conventions, syntax, format, etc
- The website will be responsive and work on different screen sizes and devices
- All images used in the website will have appropriate alt text to be accessible
- Site will include user authentication and authorization
- Users can upload, view, modify, and delete their own places
- Users can view places shared by other users
- Site will validate user input as needed for security and consistency

## Installation

### MongoDB

- Create a database 'places' with two (2) collection named: places and users
- Import data from 'database-files': places.json and users.json

### Node_Modules

- cd to 'backend' directory
- 'npm install' to install necessary modules from package.json
- cd to 'frontend' director
- 'npm install' to install necessary modules from package.json

### .env Variables Required for Frontend

- REACT_APP_API_URL = 'http://localhost:5000'
- REACT_APP_HOST_PORT = 3000
- REACT_APP_MAPS_APIKEY = 'your_api_token_here'

## .env Variables Required for Backend

- HOST_PORT = 5000
- GOOGLE_GEOCODE_APIKEY = 'your_api_token_here'
- TOKEN_PRIVATE_KEY = 'your_private_key_here'
