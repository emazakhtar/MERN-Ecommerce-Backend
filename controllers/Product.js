const model = require("../models/product");
const Product = model.Product;

// CREATE...
exports.create = async (req, res) => {
  const product = new Product(req.body);
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};

// READ...
exports.getAll = async (req, res) => {
  let query = Product.find({});
  let totalDocsQuery = Product.find({});

  // Filtering...
  if (req.query.category) {
    query = query.find({
      category: req.query.category,
    });
    totalDocsQuery = totalDocsQuery.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalDocsQuery = totalDocsQuery.find({ brand: req.query.brand });
  }

  // Sorting...
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Paginating...
  if (req.query._page && req.query._limit) {
    const page = req.query._page;
    const pageSize = req.query._limit;

    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    const totalDocs = await totalDocsQuery.count().exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.get = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Product.findById(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
