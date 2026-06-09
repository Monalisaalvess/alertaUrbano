const mongoose = require ('mongoose');
const  bcrypt   = require ('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
    },

    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    },

    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    avatar: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationTokenExpires: {
      type: Date,
      default: null,
    },

  },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('User', UserSchema);