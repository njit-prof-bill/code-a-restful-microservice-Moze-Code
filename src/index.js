const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//user info storage
let users  = []
let userUniqueId = 1; //used to give every user a unique id

//creating a new user
app.post('/users', function(req, res) {
    const { name, email } = req.body;

    //check if both name and email are provided
    if (!name || !email) {
        return res.status(400).json({error: 'Name and email are required'});
    }

    //create a new user object
    const newUser = {
        id: userUniqueId,
        name: name,
        email: email
    };

    //Add the user to the users array
    users.push(newUser);

    //Increment the unique ID counter
    userUniqueId++;

    //return the newly created user as a responce
    res.status(201).json(newUser);
});

//Retrieve user information by their "id"
app.get('/users/:id', function(req, res) {
    const userId = parseInt(req.params.id); //Extract the id from URL params

    //Finding the user with the given id
    const user = users.find(function(u) {
       return u.id === userId;
    });

    //if user is not found, return 404 error
    if(!user) {
        return res.status(404).json({ error: 'User not found'})
    }

    //if user is found, return user details(id, name, email)
    res.json(user);

});

//Update user information by their id
app.put('/users/:id', function(req, res) {
    const userId = parseInt(req.params.id); //Extract the id from URL params
    const { name, email } = req.body; //Get the new name and email from the request body

    //Check if both email are provided
    if(!name || !email) {
        return res.status(400).json({ error: 'Name and email are required'});
    }

    //Find the user with given id
    const userIndex = users.findIndex(function(u) {
        return u.id === userId;
    });

    //If user is not found, return a 404 error
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found'});
    }

    //Update the user information
    users[userIndex].name = name;
    users[userIndex].email = email;

    //Return the updated user information
    res.json(users[userIndex])

});


//Deleting a user by their id
app.delete('/users/:id', function(req, res) {
    const userId = parseInt(req.params.id); //Extract the id from URL params

    //Find the user with given id
    const userIndex = users.findIndex(function(u) {
        return u.id === userId;
    });

    //If user is not found, return a 404 error
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found'});
    }

    //Remove the user from the array "users"
    users.splice(userIndex, 1);

    //Return a 204 No content response
    res.status(204).send();

});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing