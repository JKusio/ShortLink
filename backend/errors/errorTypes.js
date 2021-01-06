module.exports = {
    registerErrors: {
        wrongUsernameLength: {
            code: 101,
            message: 'Username too short/long'
        },
        wrongEmail: {
            code: 102,
            message: 'Email not correct'
        },
        wrongPasswordLength: {
            code: 103,
            message: 'Password too short/long'
        },
        usernameTaken: {
            code: 104,
            message: 'Username already taken'
        },
        emailTaken: {
            code: 105,
            message: 'Email already taken'
        },
        wrongVerficationToken: {
            code: 106,
            message: 'Wrong verification token'
        }
    },
    loginErrors: {
        wrongCredentials: {
            code: 201,
            message: 'Wrong name/password combination'
        },
        accountNotVerified: {
            code: 202,
            message: 'Account not verified'
        },
        notAuthenticated: {
            code: 203,
            message: 'Not authenticated'
        },
        noAdminAccess: {
            code: 204,
            message: 'No admin access'
        }
    },
    linkErrors: {
        wrongURL: {
            code: 301,
            message: 'Wrong URL'
        },
        customURLTaken: {
            code: 302,
            message: 'Custom URL taken'
        },
        wrongCustomURL: {
            code: 303,
            message: 'Custom URL has forbidden characters'
        },
        wrongExpirationDateFormat: {
            code: 304,
            message: 'Wrong expiration date format'
        },
        expirationDatePassed: {
            code: 305,
            message: 'Expiration date passed'
        }
    },
    serverErrors: {
        mongodbConnectionError: {
            code: 401,
            message: 'No MongoDB connection'
        },
        linksCounterError: {
            code: 402,
            message: 'No LinksCounter found'
        }
    },
    otherErrors: {
        notFound: {
            code: 501,
            message: 'No URL found'
        }
    }
}