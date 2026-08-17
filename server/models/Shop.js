import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Food', 'Groceries', 'Fruits'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    },
    imageType: {
      type: String,
      enum: ['upload', 'url'],
      default: 'url',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numRatings: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'IIT Indore Campus',
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
