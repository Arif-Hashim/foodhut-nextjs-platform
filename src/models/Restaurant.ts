import mongoose, { Schema } from 'mongoose';

const RestaurantSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  type: { type: String, enum: ['Restaurant', 'Home-Made'], default: 'Restaurant' },
  cuisine: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  deliveryTime: { type: String, default: '25-35 min' },
  address: { type: String, required: true },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);
