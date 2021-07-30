const slugify = require('slugify');
const mongoose = require('mongoose');
const validator = require('validator');

// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [5, 'A tour name must have more or equal then 5 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain character']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {  //String 에만 적용 가능
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 //4.66666, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                // this only points to curren doc on NEW document creation
                return val < this.price; // 100 < 200
        },
        message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false  // 클라에 필드 정보를 보내지 않음
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }

    ]
}, { // 가상 필드 사용을 위해 필요한 옵션
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

// tourSchema.index({ price: 1 })   // index를 사용하여 검색 (읽기 속도 향상) 1 내림차순, -1 오름차순 정렬
// tourSchema.index({ price: 1 , ratingsAverage: -1 }) 
// tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

// 가성 필드 정의 
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7
})

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review', 
    foreignField: 'tour', 
    localField: '_id'    //id가 저장되는 곳
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// tourSchema.pre('save', async function(next) {
//     this.guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(this.guidesPromises)
//     next()
// })

// tourSchema.pre('save', function(next){
//     console.log('Will save document...')
//     next()
// })

// tourSchema.post('save', function(doc, next) {
//     console.log(doc)
//     next()
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){
// tourSchema.pre('find', function(next){
    this.find({ secretTour: { $ne: true }})
    this.start = Date.now()
    next()
})

tourSchema.pre(/^find/, function(next){
    // this 는 언제나 현재의 쿼리를 가리킨다.
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next()
})

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`)
    console.log(docs)
    next()
})


// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next){
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true }}})
//     console.log(this.pipeline())
//     next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;