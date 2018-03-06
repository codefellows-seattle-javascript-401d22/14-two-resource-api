## Two Resource API (MONGO)

## Installation

1. Clone this repository
2. Navigate to this your cloned directory, and run an `npm i`
3. Once the packages are installed, you can run `npm run start` to start the server, or `npm run test` to run the tests.

## List routes

#### POST: `localhost:3000/api/list` Create a list

#### GET: `localhost:3000/api/list/:listId` Find a list based on ID

#### PUT: `localhost:3000/api/list/:listId` Update a list based on ID

#### DELETE: `localhost:3000/api/list/:listId` Delete a list based on ID

***************************************

## Movie routes

#### POST: `localhost:3000/api/list/:listId/movie` Create a movie and add it to a specified list of movies based on list ID