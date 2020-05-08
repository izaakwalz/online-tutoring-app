const Async = require('../utils/Async');
// (e.g) .. api/v1/model/:id
exports.get_one = (Model, popOptions) =>
  Async(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(
        res.status(400).json({
          success: false,
          error: 'Opps!, No document found with that ID',
        })
      );
    }

    res.status(200).json({
      status: true,
      data: {
        data: doc,
      },
    });
  });

exports.get_category = (Model, popOptions) =>
  Async(async (req, res, next) => {
    let query = Model.find({
      category: req.query.category,
    });
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(
        res.status(400).json({
          success: false,
          error: 'Opps!, No document found with that ID',
        })
      );
    }

    res.status(200).json({
      status: true,
      data: {
        data: doc,
      },
    });
  });

exports.get_all = (Model) =>
  Async(async (req, res, next) => {
    const doc = await Model.find({}).sort({ name: 1 });

    // SEND RESPONSE
    res.status(200).json({
      status: true,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
