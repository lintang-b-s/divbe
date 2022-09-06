if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }

const mongoose = require('mongoose');
const animals  = require('./animals');
const { name } = require('./seedHelpers');
const Product = require('../models/product');
const dbUrl = process.env.DB_URL
// 'mongodb://localhost:27017/toko-hewan'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const random15 = Math.floor(Math.random() * 15);
        const price = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            //YOUR USER ID
            author: '631739db43a99315d4a89247',
            category : `${animals[random15].category}`,
            name: `${sample(name)} `,
            description: `${animals[random15].description}`,
            price,
            images: [
                {
                    url: `${animals[random15].image}`,
                    filename: `${animals[random15].species}`
                },
                {
                    url: `${animals[random15].image}`,
                    filename: `${animals[random15].species}`
                }
            ]
            //mungkin harus di seed review disini
        })
        await product.save();
    }
}

// const seedDB = async () => {
//     await Product.deleteMany({});
//     for (let i = 0; i < 300; i++) {
//         const random15 = Math.floor(Math.random() * 15);
//         const price = Math.floor(Math.random() * 20) + 10;
//         const product = new Product({
//             //YOUR USER ID
//             author: '6316e2e82be9824338038bd3',
//             category : `babi`,
//             name: `babi `,
//             description: `babi`,
//             price,
//             images: [
//                 {
//                     url: `https://s25.postimg.org/g0auhuu7z/totoise_large.jpg`,
//                     filename: `reptil`
//                 },
//                 {
//                     url: `https://s25.postimg.org/g0auhuu7z/totoise_large.jpg`,
//                     filename: `reptil`
//                 }
//             ]
//         })
//         await product.save();
//     }
// }


seedDB().then(() => {
    mongoose.connection.close();
})