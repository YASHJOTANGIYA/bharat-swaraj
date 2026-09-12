const mongoose = require('mongoose');
const News = require('./models/News');

mongoose.connect('mongodb://localhost:27017/bharat_swaraj')
    .then(async () => {
        console.log('✅ Connected to MongoDB\n');

        const allNews = await News.find({});
        console.log(`📰 Total news articles: ${allNews.length}\n`);

        console.log('📋 Articles with videos:\n');
        allNews.forEach((news, index) => {
            if (news.video) {
                console.log(`${index + 1}. ${news.title}`);
                console.log(`   Video URL: ${news.video}`);
                console.log(`   Image URL: ${news.image}`);
                console.log(`   Category: ${news.category}`);
                console.log('');
            }
        });

        const withVideo = allNews.filter(n => n.video);
        const withoutVideo = allNews.filter(n => !n.video);

        console.log(`\n📊 Summary:`);
        console.log(`   Articles with video: ${withVideo.length}`);
        console.log(`   Articles without video: ${withoutVideo.length}`);

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
