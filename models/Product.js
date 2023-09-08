const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// Clear the model cache if the model already exists
if (mongoose.connection.models["Product"]) {
  delete mongoose.connection.models["Product"];
}

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0, max: 10000 },
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  stock: { type: Number, required: true, min: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: Array, required: true },
  deleted: { type: String },
});

const virtualId = productSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});
// we can't sort using the virtual fields. better to make this field at time of doc creation
// const virtualDiscountPrice =  productSchema.virtual('discountPrice');
// virtualDiscountPrice.get(function(){
//     return Math.round(this.price*(1-this.discountPercentage/100));
// })
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model("Product", productSchema);
