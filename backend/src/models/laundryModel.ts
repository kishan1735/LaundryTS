import mongoose from "mongoose";

export interface LaundryType extends mongoose.Document {
  name: string;
  studentId: string;
  studentPhoneNumber: string;
  studenyAddress: string;
  deliveryDate: Date;
  list: Object;
  totalCost: number;
  status: String;
}

const laundrySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentPhoneNumber: {
    type: Number,
    required: true,
  },
  studentAddress: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: Date,
    default: new Date(new Date().getDate() + 3),
  },
  list: {
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
  totalCost: {
    type: Number,
    required: [true, "Total cost cannot be calculated- Error in details"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "active", "ready", "deliver"],
  },
});

const Laundry =
  mongoose.models.Laundry || mongoose.model("Laundry", laundrySchema);

export default Laundry;
