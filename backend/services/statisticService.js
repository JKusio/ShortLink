const Statistic = require('../model/statistic'); 

class StatisticService {
    async getAllStatistics() {
        return Statistic.find();
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