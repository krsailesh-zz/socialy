
# Socialy

A social media web application build with MongoDB, Express, React and Nodejs.


## Demo

[Have a look at the live demo](http://socialy2001.herokuapp.com/)


![Showcase GIF](/screenshots/first-part.gif)


## Tech

Tech used in this project :

- Frontend: [React](https://reactjs.org/)
- State management: [Redux](https://redux.js.org/)
- Routing: React [Router](https://reactrouter.com/)
- Backend: [Express](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Image hosting: [Cloudinary](https://cloudinary.com/)
  
  
## Installation

### Clone

- Clone this repo to your local machine using `https://github.com/krsailesh2001/socialy.git`

### Setup

> Install npm dependencies using npm install

```shell
$ npm install && cd client && npm install
```

> Set up a MongoDB database on [MongoDB atlas](https://www.mongodb.com/cloud/atlas).
> Create a free [cloudinary account](https://cloudinary.com/) to upload images.
> Create a dev.js file.
> Set up required variables.

```javascript
MONGODBURI:
JWT_SECRET:
GMAIL_USER:
GMAIL_APP_PASS:
DOMAIN:
```

> In the root directory run the backend.
```shell
$ npm run dev
```

> In the client directory run the frontend.
```shell
$ npm run start
```

> Go to your favourite browser and then go to `http://localhost:5000/`
