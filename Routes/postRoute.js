const Post = require('../Models/Post');
const { protect, role } = require('./../middleware/authmiddleware');
const router = require('express').Router();
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');

router.get(
  '/trending',
  catchAsync(async (req, res, next) => {
    const trendingPost = await Post.aggregate([
      {
        $group: {
          _id: '$category',
          numCategory: { $sum: 1 },
        },
      },
      { $sort: { numCategory: -1 } },
    ]);

    res.status(200).json(trendingPost);
  })
);

// get popular posts
// use this
router.get(
  '/top3posts',
  catchAsync(async (req, res, next) => {
    const top3 = await Post.aggregate([
      {
        $project: {
          id: 1,
          title: 1,
          slug: 1,
          photo: 1,
          author: 1,
          createdAt: 1,
          like_length: { $size: '$favourites' },
          comment_length: { $size: '$comments' },
        },
      },
      { $sort: { like_length: -1, comment_length: -1 } },
      { $limit: 3 },
    ]);

    await Post.populate(top3, { path: 'author', select: { name: 1 } });

    res.status(200).json(top3);
  })
);

// this works but not dynamic
router.get(
  '/popularPosts',
  catchAsync(async (req, res, next) => {
    const posts = await Post.find({})
      .sort({ 'favourites.length': -1 })
      .limit(3);
    if (posts.length === 0) {
      return next(new AppError('No posts exist', 404));
    }

    res.status(200).json(posts);
  })
);

router.get('/search', async (req, res) => {
  const searchQuery = req.query.searchQuery;
  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await Post.find({ title: { $regex: title } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    if (posts.length === 0) {
      return next(new AppError('No posts exist', 404));
    }

    res.status(200).json(posts);
  })
);

router.get(
  '/:slug',
  catchAsync(async (req, res, next) => {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return next(new AppError('No post with that such title', 404));
    }

    res.status(200).json(post);
  })
);

router.post(
  '/myUserDetail',
  protect,
  catchAsync(async (req, res, next) => {
    const posts = await Post.find({ author: req.user.id }).sort({
      createdAt: -1,
    });
    if (posts.length === 0) {
      return next(new AppError('No posts exist', 404));
    }
    res.status(200).json(posts);
  })
);

router.post(
  '/userDetail',
  protect,
  catchAsync(async (req, res, next) => {
    const posts = await Post.find({ author: req.body.author }).sort({
      createdAt: -1,
    });
    if (posts.length === 0) {
      return next(new AppError('No posts exist', 404));
    }
    res.status(200).json(posts);
  })
);

router.post(
  '/create',
  protect,
  catchAsync(async (req, res, next) => {
    var opsys = process.platform;
    if (opsys == 'darwin') {
      opsys = 'OS Web App';
    } else if (opsys == 'win32' || opsys == 'win64') {
      opsys = 'Windows Web App';
    } else if (opsys == 'linux') {
      opsys = 'Linux Web App';
    } else {
      opsys = 'Mobile Web App';
    }

    const newPost = await Post.create({
      operationSystem: opsys,
      author: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      status: 'success',
      newPost,
    });
  })
);

router.put(
  '/addToFavourite/:id',
  protect,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!req.user.id) {
      return res.json({ message: 'Unauthenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`No post with id: ${id}`, 404));
    }

    const post = await Post.findById(id);

    const index = post.favourites.findIndex((id) => id === String(req.user.id));

    if (index === -1) {
      post.favourites.push(req.user.id);
    } else {
      post.favourites = post.favourites.filter(
        (id) => id !== String(req.user.id)
      );
    }
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
    // try {
    //   const post = await Post.findById(id);
    //   if (!post.favourites.includes(req.user.id)) {
    //     await post.updateOne({ $push: { favourites: req.user.id } });
    //     res.status(200).json('Post liked');
    //   } else {
    //     await post.updateOne({ $pull: { favourites: req.user.id } });
    //     res.status(200).json('Post Unliked');
    //   }
    // } catch (error) {
    //   res.status(500).json(error);
    // }
  })
);

router.post('/:id/comment', protect, async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  post.comments.push(req.body.comments);

  const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
});

router.put(
  '/update/:id',
  protect,
  catchAsync(async (req, res, next) => {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return next(new AppError('No post with this id', 404));
    }

    res.status(201).json(updatedPost);
  })
);

router.delete(
  '/delete/:id',
  protect,
  catchAsync(async (req, res, next) => {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return next(new AppError('No post with this id', 404));
    }

    res.status(204).json({
      deletedPost,
    });
  })
);

module.exports = router;
