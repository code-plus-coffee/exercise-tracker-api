const shortid = require('shortid')

const user = require('../src/models/user.model')

/** Generate short ids from these chars. */
shortid.characters(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
)

/** User class to handle all the user related operations. */
class User {
    /**
     * Initializes username.
     * @param {string} username
     */
    constructor(username) {
        this.username = username
    }
}

/**
 * Validates if username exists & writes user data to the database.
 * @param {Response} res
 */
User.prototype.save = function (res) {
    let { username } = this

    user.findOne({ username: username }, function (err, doc) {
        if (err) {
            res.json({ error: 'Cannot create new user!' })
        } else if (doc) {
            res.json({ error: 'Username already exists!' })
        } else {
            let newUser = new user({
                username: username,
                _id: shortid.generate(),
            })

            newUser
                .save()
                .then(function (user) {
                    res.json({
                        username: user.username,
                        _id: user._id,
                    })

                    console.log('Added new user!')
                })
                .catch(function (err) {
                    res.json({ error: 'Unable to create new user!' })

                    console.log('Unable to add new user!', err)
                })
        }
    })
}

/**
 * Method to get all users from the database.
 * @static
 * @param {Response} res
 */
User.getAllUsers = function (res) {
    user.find({}, function (err, users) {
        if (err) {
            res.json({ error: 'Could not get users!' })
        }

        let userData = []

        users.forEach(function (user) {
            userData.push({
                _id: user._id,
                username: user.username,
            })
        })

        res.json(userData)
    })
}

module.exports = User
