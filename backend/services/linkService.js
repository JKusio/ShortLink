const config = require('../config');
const Link = require('../model/link');
const LinksCounter = require('../model/linksCounter'); 
// Error handling
const BaseError = require('../errors/baseError');
const errorTypes = require('../errors/errorTypes');
const httpStatusCodes = require('../errors/httpStatusCodes');

class LinkService {
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

    #checkIfURLIsCorrect = (URL) => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(URL);
    }

    #generateShortCode = (id) => {
        let shortURL = [];
    
        while (id) {
            shortURL.push(this.characters[id%this.characters.length]);
            id = parseInt(id / this.characters.length, 10);
        }
    
        shortURL.reverse();
    
        return shortURL.join("");
    }

    #checkIfCustomCodeIsCorrect = (code) => {
        for (let i = 0; i < code.length; i++) {
            if (!this.characters.includes(code[i])) return false;
        }
        return true;
    }

    #getIDFromShortCode = (code) => {
        let id = 0;

        for (let i = 0; i < URL.length; i++) {
            if ('a' <= URL[i] && URL[i] <= 'z') 
                id = id * 62 + URL[i].charCodeAt(0) - 'a'.charCodeAt(0); 
            if ('A' <= URL[i] && URL[i] <= 'Z') 
                id = id * 62 + URL[i].charCodeAt(0) - 'A'.charCodeAt(0) + 26; 
            if ('0' <= URL[i] && URL[i] <= '9') 
                id = id * 62 + URL[i].charCodeAt(0) - '0'.charCodeAt(0) + 52;     
        }

        return id;
    }

    async getAllLinks() {
        return await Link.find();
    }

    async createLink(URL, host, userID = undefined, customCode = undefined, expirationDate = undefined) {
        if (!this.#checkIfURLIsCorrect(URL)) throw new BaseError(errorTypes.linkErrors.wrongURL, httpStatusCodes.BAD_REQUEST, true);

        const linksCounter = await LinksCounter.findOne();
        if (!linksCounter) throw new BaseError(errorTypes.serverErrors.linksCounterError, httpStatusCodes.INTERNAL_SERVER, false);

        if (customCode) {
            if (await Link.exists({code: customCode})) {
                throw new BaseError(errorTypes.linkErrors.customURLTaken, httpStatusCodes.BAD_REQUEST, true);
            } else if (!this.#checkIfCustomCodeIsCorrect(customCode)) {
                throw new BaseError(errorTypes.linkErrors.wrongCustomURL, httpStatusCodes.BAD_REQUEST, true);
            }
        }

        const code = customCode || this.#generateShortCode(linksCounter.currentID);

        const link = new Link({
            code,
            originalURL: URL
        });

        if (expirationDate) {
            const expDate = Date.parse(expirationDate);
            if (!expDate) throw new BaseError(errorTypes.linkErrors.wrongExpirationDateFormat, httpStatusCodes.BAD_REQUEST, true);
            if (Date.now() >= expDate) throw new BaseError(errorTypes.linkErrors.expirationDatePassed, httpStatusCodes.BAD_REQUEST, true);
            link.expirationDate = expDate;
        }

        if (userID) {
            link.userID = userID;
        }

        try {
            await link.save();

            if (!customCode) {
                linksCounter.currentID += 1;
                await linksCounter.save();
            }

            const {code, originalURL, creationDate, expirationDate} = link;

            return {
                code,
                originalURL,
                creationDate,
                expirationDate,
                completeURL: `${host}/${code}`
            };
        } catch (err) {
            link.remove();
            throw err;
        }
    }
}

module.exports = new LinkService();