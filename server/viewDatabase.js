const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB\n');

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections in database:');
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Get news count
        const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
        const newsCount = await News.countDocuments();
        console.log(`\n📰 Total news articles: ${newsCount}`);

        // Show all news
        if (newsCount > 0) {
            console.log('\n📋 Your News Articles:\n');
            const allNews = await News.find().sort({ createdAt: -1 });
            allNews.forEach((news, index) => {
                console.log(`${index + 1}. ${news.title}`);
                console.log(`   Category: ${news.category}`);
                console.log(`   Date: ${new Date(news.createdAt).toLocaleDateString()}`);
                console.log(`   ID: ${news._id}\n`);
            });
        } else {
            console.log('\n⚠️  No news articles found in database.');
            console.log('   Go to http://localhost:5173/admin to add some!\n');
        }

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('\n💡 Make sure MongoDB is running!');
        console.log('   Run: mongod');
    });
