import mongoose, { Schema } from 'mongoose';

const FoodSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantName: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.8 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  isHomeMade: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Food || mongoose.model('Food', FoodSchema);
