import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String, // qlqr tipo primitivo do js
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // serve como o createAt e updatedAt do postgres
  }
);

export default mongoose.model('Notification', NotificationSchema);
