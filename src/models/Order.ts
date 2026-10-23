import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: [{
    foodId: String,
    name: String,
    price: Number,
    quantity: Number,
    restaurantName: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
