import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@iiti\.ac\.in$/,
        'Only @iiti.ac.in email addresses are accepted',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['customer', 'shop_owner', 'delivery_partner', 'admin'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: function () {
        return this.role === 'customer' || this.role === 'admin' ? 'approved' : 'pending';
      },
    },
    hostel: {
      type: String,
      enum: [
        'CVR',
        'VSB',
        'APJ',
        'DA',
        'HJB',
        'LRC',
        'Sports Complex',
        'Takshashila Complex',
        'JC Bose',
        'Amul',
        'Kendriya Vidyalaya',
        'Other',
      ],
      default: 'APJ',
    },
    roomNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
