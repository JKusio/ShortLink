module.exports = {
    credentialsError: {
        wrongUsername: {
            code: 101,
            message: 'Username not correct! It needs to be between 5 and 16 characters and contain only standard alphabet characters, numbers and . - _'
        },
        wrongEmail: {
            code: 102,
            message: 'Email not correct'
        },
        wrongPassword: {
            code: 103,
            message: 'Password not correct! It needs to be between 8 and 24 characters. It needs to contain at least 1 number and 1 special character!'
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
        },
        linkNotExisting: {
            code: 306,
            message: 'Link does not exists'
        },
        linkExpired: {
            code: 307,
            message: 'Link expired'
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
    userErrors: {
        userDoesNotExists: {
            code: 501,
            message: 'User does not exists'
        }
    },
    otherErrors: {
        notFound: {
            code: 601,
            message: 'No URL found'
        }
    },
}