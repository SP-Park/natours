const Tour = require('./../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const tours = await features.query
    // query.sort().select().skip().limit()

    res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
        tours: tours
    }
})

    // try {

    //     //filter 의 2 방법
    //     // const tours = await Tour.find({
    //     //     duration: 5,
    //     //     difficulty: 'easy'
    //     // })

    //     // const tours = await Tour.find()
    //     // .where('duration')
    //     // .lte(5)
    //     // .where('difficulty')
    //     // .equals('easy')


    //     //Build Query
    //     // 1A. filtering
    //     // const queryObj = {...req.query}
    //     // const excludedFields = ['page', 'sort', 'limit', 'fields']
    //     // excludedFields.forEach(el => delete queryObj[el])
    //     // console.log(req.query, queryObj)

    //     // // 1B. Advanced filtering
    //     // let queryStr = JSON.stringify(queryObj)
    //     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    //     // // console.log(JSON.parse(queryStr))

    //     // // DB: { difficulty: 'easy', duration: {$gte: 5 }}
    //     // // url query: { difficulty: 'easy', duration: { gte: '5' }}
    //     // // gte, gt, lte, lt

    //     // let query = Tour.find(JSON.parse(queryStr))
    //     // 2. Sorting
    //     // if(req.query.sort) {
    //     //     const sortBy = req.query.sort.split(',').join(' ');
    //     //     console.log(sortBy)
    //     //     query = query.sort(sortBy)
    //     // // ?sort=price 또는 ?sort=-price (내림차순)
    //     // // 기준이 여러개 ?sort=price,createdAt 또는 ?sort=-price,createdAt ?sort=-price,-createdAt
    //     // } else {
    //     //     query = query.sort('-createdAt')
    //     // }

    //     // 3. Field limiting
    //     // if(req.query.fields) {
    //     //     const fields = req.query.fields.split(',').join(' ');
    //     //     query = query.select(fields)
    //     // } else {
    //     //     query = query.select('-__v')
    //     // }


    //     // 4. Pagination
    //     // const page = req.query.page * 1 || 1;
    //     // const limit = req.query.limit * 1 || 100;
    //     // const skip = (page - 1) * limit;
    //     // // ?page=2&limit=10, 1-10 page 1, 11-20 page2
    //     // query = query.skip(skip).limit(limit)

    //     // if(req.query.page) {
    //     //     const numTours = await Tour.countDocuments();
    //     //     if(skip >= numTours) throw new Error('This page does not exist')
    //     // }

    //     //Execute query
    //     // const tours = await Tour.find(JSON.parse(queryStr))
    //     // const tours = await query
        
    //     // 재사용을 위한 리팩토링
    //     const features = new APIFeatures(Tour.find(), req.query)
    //         .filter()
    //         .sort()
    //         .limitFields()
    //         .paginate()
    //     const tours = await features.query
    //     // query.sort().select().skip().limit()

    //     res.status(200).json({
    //         status: 'success',
    //         result: tours.length,
    //         data: {
    //             tours: tours
    //         }
    //     })
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }

})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({ _id: req.params.id })

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tours: tour
        }
    })
    // try {
    //     const tour = await Tour.findById(req.params.id)
    //     // Tour.findOne({ _id: req.params.id })

    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             tours: tour
    //         }
    //     })
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }

})



exports.createTour = catchAsync(async (req, res, next) => {

    const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })

    // try {
    //     // const newTour = new Tour({})
    //     // newTour.save()
    //     const newTour = await Tour.create(req.body);

    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     })
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }

})

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
    // try {
    //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    //         new: true,
    //         runValidators: true
    //     })
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             tour: tour
    //         }
    //     })
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: 'Invalid data sent!'
    //     })
    // }

})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)
    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
    // try {
    //     await Tour.findByIdAndDelete(req.params.id)
    //     res.status(204).json({
    //         status: 'success',
    //         data: null
    //     })
    // } catch (Err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }

})

exports.getTourStates = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 }}
        },
        {
            $group: {
                // _id: null, 
                _id: { $toUpper: '$difficulty'},  //difficulty 기준별로 바로 통계가능
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' }}
        // }
    ]) 
    res.status(200).json({
        status: 'success',
        data: {
            stats: stats
        }
    })
    // try {
    //     const stats = await Tour.aggregate([
    //         {
    //             $match: { ratingsAverage: { $gte: 4.5 }}
    //         },
    //         {
    //             $group: {
    //                 // _id: null, 
    //                 _id: { $toUpper: '$difficulty'},  //difficulty 기준별로 바로 통계가능
    //                 numTours: { $sum: 1 },
    //                 numRatings: { $sum: '$ratingsQuantity'},
    //                 avgRating: { $avg: '$ratingsAverage' },
    //                 avgPrice: { $avg: '$price' },
    //                 minPrice: { $min: '$price' },
    //                 maxPrice: { $max: '$price' }
    //             }
    //         },
    //         {
    //             $sort: { avgPrice: 1 }
    //         },
    //         // {
    //         //     $match: { _id: { $ne: 'EASY' }}
    //         // }
    //     ]) 
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             stats: stats
    //         }
    //     })
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            // {
            //     $limit: 12
            // }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan: plan
            }
        })
    // try {
    //     const year = req.params.year * 1;
    //     const plan = await Tour.aggregate([
    //         {
    //             $unwind: '$startDates'
    //         },
    //         {
    //             $match: {
    //                 startDates: {
    //                     $gte: new Date(`${year}-01-01`),
    //                     $lte: new Date(`${year}-12-31`),
    //                 }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: { $month: '$startDates'},
    //                 numTourStarts: { $sum: 1 },
    //                 tours: { $push: '$name'}
    //             }
    //         },
    //         {
    //             $addFields: { month: '$_id'}
    //         },
    //         {
    //             $project: {
    //                 _id: 0
    //             }
    //         },
    //         {
    //             $sort: { numTourStarts: -1 }
    //         },
    //         // {
    //         //     $limit: 12
    //         // }
    //     ])

    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             plan: plan
    //         }
    //     })
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
})