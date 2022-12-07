require('babel-register');
 
const router = require('./router').default;
const Sitemap = require('../public').default;
 
(
    new Sitemap(router)
        .build('https://dudeplex.space')
        .save('./sitemap-react.xml')
);