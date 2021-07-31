const hpp = require('hpp');
const path = require('path');
const xss = require('xss-clean');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express()


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))



// 1. GLOBAL MIDDELWARE
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

// Devlopement logging
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Limit request from same API
// DDOs 공격 방지 > 설정 후 header X-RateLimit-Limit 부분에 max 에서 설정한 100 이 표시되며 접속 시도시 마다 X-RateLimit-Remaining 에서 카운트됨
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,    //millisecond
    message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data snitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))



// Test middleware 
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.requestTime)
    // console.log(req.headers)
    next()
})

// 2. ROUTE HANDLERS


// 3. ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter)
app.all('*', (req, res,next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    // err.status = 'fail'
    // err.statusCode = 404
    // next(err)
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
    
})

app.use(globalErrorHandler)

// 4. START SERVER

module.exports = app;