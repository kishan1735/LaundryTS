import mongoose from "mongoose";

type Rating = {
  id: string;
  rating: number;
  description: string;
};
export interface ShopType extends mongoose.Document {
  name: string;
  address: string;
  ownerId: string;
  contactNumber: number;
  ratings: Array<Object>;
  satisfied: number;
  unsatisfied: number;
  price: Object;
  laundry: Array<Object>;
}
const RatingSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  rating: { type: Number, sparse: true },
  description: { type: String, sparse: true },
});

const laundrySchema = new mongoose.Schema({
  laundryId: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    unique: true,
  },
  totalCost: {
    type: Number,
  },
});
const shopSchema = new mongoose.Schema<ShopType>({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: [true, "You have to provide contact details"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "You have to provide shop's address"],
    unique: true,
  },
  ownerId: {
    required: true,
    type: String,
  },
  ratings: {
    type: [RatingSchema],
    default: [],
    sparse: true,
  },
  satisfied: {
    type: Number,
    default: 0,
  },
  unsatisfied: {
    type: Number,
    default: 0,
  },
  price: {
    tshirt: {
      type: Number,
      default: 0,
    },
    shirt: {
      type: Number,
      default: 0,
    },
    shorts: {
      type: Number,
      default: 0,
    },
    pant: {
      type: Number,
      default: 0,
    },
    towel: {
      type: Number,
      default: 0,
    },
    bedsheet: {
      type: Number,
      default: 0,
    },
    pillowCover: {
      type: Number,
      default: 0,
    },
  },
  laundry: {
    type: [laundrySchema],
    default: [],
    sparse: true,
  },
});

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);

export default Shop;
