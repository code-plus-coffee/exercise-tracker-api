const user = require('../src/models/user.model')

/**
 * Exercise container to handle related methods.
 */
class Exercise {
    constructor(userId, description, duration, date) {
        this.userId = userId
        this.description = description
        this.duration = duration
        this.date = date.length
            ? new Date(date).toDateString()
            : new Date().toDateString()
    }
}

/**
 * Validate & write exercise log to the database.
 * @param {Response} res
 */
Exercise.prototype.save = function (res) {
    user.findOneAndUpdate(
        { _id: this.userId },
        {
            $push: {
                log: {
                    description: this.description,
                    duration: this.duration,
                    date: this.date,
                },
            },
            $inc: { count: 1 },
        },
        { new: true },
        function (err, doc) {
            if (err) {
                return console.error(err)
            }

            let log = doc.log
            let { description, duration, date } = log[log.length - 1]

            res.json({
                userId: doc._id,
                description: description,
                duration: duration,
                date: date,
                username: doc.username,
            })
        }
    )
}

/**
 * Static method to get the exercise log of a user by ID.
 * @static
 * @param {string} id
 * @param {Response} res
 */
Exercise.getLogById = function (id, res) {
    user.findOne({ _id: id }, function (err, doc) {
        if (err) {
            res.json({ error: 'Could not get the user!' })
        }

        res.json({
            _id: doc._id,
            username: doc.username,
            count: doc.count,
            log: doc.log,
        })
    })
}

module.exports = Exercise