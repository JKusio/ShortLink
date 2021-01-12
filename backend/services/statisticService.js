const Statistic = require('../model/statistic'); 
// Error handling
const BaseError = require('../error/baseError');
const errorTypes = require('../error/errorTypes');
const httpStatusCodes = require('../error/httpStatusCodes');

class StatisticService {
    async getAllStatistics() {
        return await Statistic.find();
    }

    async createStatistic(referer, language, linkCode) {
        await Statistic.create({
            referer,
            language,
            linkCode
        });
    }
}

module.exports = new StatisticService();