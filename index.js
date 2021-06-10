const debug = require('debug')('app:startup');
const config = require('config')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const courses = require('./routes/courses');
const rental = require('./routes/rentals');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwt is not defined');
    process.exit(1)
}

mongoose.connect('mongodb://localhost:27017/playground')
    .then(() => console.log("Connected to  MongoDb..."))
    .catch(err => console.error('could not connect mongodb' + err));
//middleware app.use(express.urlencoded({Extendented:true}))
app.use(express.json());

app.use(express.static('public'));
app.set("view engine", 'pug');
app.set("views", './views');

app.use(helmet());
app.use('/api/courses', courses);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rental', rental);
app.use('/api/users', users);
app.use('/api/auth', auth);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('morgan enabled'); //console.log()
}

//debug("connected database");

app.get('/', (req, res) => {
    res.render('index', { title: "My Express", message: "hello" })
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listning port on ${port} ...`);
})


//console.log("application name:" + config.get('name'))

/*
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 2, maxLength: 100 },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (v, callback) {
                setTimeout(() => {
                    const result = v && v.length > 0;
                    callback(result);
                }, 1000)
            },
            message: "A must array atleast one element"
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile'],
        lowercase: true,
        uppercase: true,
        trim: true
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished
        },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourese() {
    const course = new Course({
        name: 'go',
        author: 'jack',
        category: 'Web',
        tags: ['PHP', 'React'],
        isPublished: true,
        price: 15.8
    });

    try {
        const result = await course.save();
        // console.log(result);
    } catch (ex) {
        for (fieled in ex.errors) {
            console.log(ex.errors[fieled].message);
        }
    }
}


createCourese();

async function updateCourse(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'jack',
            isPublished: false
        }
    }, { new: true });

}




async function deleteCourse(id) {
    const course = await Course.findByIdAndRemove(id);
    // console.log(course)
}
deleteCourse('60ada9a772885c43a434b4d4');


async function getCourses() {
    const pageNumber = 2;
    const pageSize = 4;

    const courses = await Course.find({ tags: { $in: ['front', 'backend'] } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select({ name: 1, tags: 1, author: 1 })
        .sort({ name: 1 });
     console.log(courses);
}

getCourses();
 */
