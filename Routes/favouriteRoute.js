const Favourite = require('../Models/Favourite');
const { protect, role } = require('./../middleware/authmiddleware');
const router = require('express').Router();
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

router.post(
  '/addToFavourite',
  protect,
  catchAsync(async (req, res, next) => {
    const newFavourite = await Favourite.create({
      userId: req.body.userId,
      postId: req.body.postId,
    });

    res.status(201).json({
      success: true,
    });
  })
);

router.post(
  '/removeFromFavourite',
  protect,
  catchAsync(async (req, res, next) => {
    const newFavourite = await Favourite.findOneAndDelete({
      userId: req.user.id,
      postId: req.body.postId,
    });

    res.status(204).json({
      success: true,
    });
  })
);

router.post(
  '/getFavourite',
  protect,
  catchAsync(async (req, res, next) => {
    const favourites = await Favourite.find({
      userId: req.body.userId,
    }).sort({ _id: -1 });

    if (favourites.length === 0) {
      return next(new AppError('No favourites exist', 404));
    }

    res.status(200).json({
      favourites,
    });
  })
);

router.post(
  '/favourited',
  protect,
  catchAsync(async (req, res, next) => {
    const favourited = await Favourite.find({
      userId: req.user.id,
      postId: req.body.postId,
    });

    let result = false;
    if (favourited.length !== 0) {
      result = true;
    }

    res.status(200).json({
      success: true,
      favourited: result,
    });
  })
);

module.exports = router;
