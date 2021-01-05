const config = require('../config');
const Link = require('../model/link');
const LinksCounter = require('../model/linksCounter'); 

class LinkService {
    constructor() {
    }

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
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let shortURL = [];
    
        while (id) {
            shortURL.push(characters[id%characters.length]);
            id = parseInt(id / 62, 10);
        }
    
        shortURL.reverse();
    
        return shortURL.join("");
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

    async createLink(URL, userID = undefined, customCode = undefined, expirationDate = undefined) {
        if (!this.#checkIfURLIsCorrect(URL)) throw new Error({code: 301});

        const linksCounter = await LinksCounter.findOne();
        if (!linksCounter) throw new Error({code: 302});

        if (customCode && Link.exists({code: customCode})) throw new Error({code: 303});

        const code = customCode || this.#generateShortCode(linksCounter.currentID);

        console.log(code);

        const link = new Link({
            code,
            originalURL: URL
        });

        if (expirationDate) {
            link.expirationDate = expirationDate;
        }

        if (userID) {
            link.userID = userID;
        }

        try {
            await link.save();
            linksCounter.currentID += 1;
            await linksCounter.save();
        } catch (err) {
            console.log(err);
            link.remove();
            throw err;
        }
    }
}

module.exports = new LinkService();