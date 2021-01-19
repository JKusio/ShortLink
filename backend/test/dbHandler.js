const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

// Connecting to in-memory db
async function connect() {
    const uri = await mongod.getUri();

    await mongoose.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

// Clear db
async function clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

// Stop db
async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports = {
    connect,
    clearDatabase,
    closeDatabase
};
