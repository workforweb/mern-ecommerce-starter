const mongoose = require('mongoose');

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const nameRegex = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;

const usernameRegex = /^[a-z0-9_\.]+$/;

// const ObjectId = mongoose.Schema.Types.ObjectId;

//define schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (name) => nameRegex.test(name),
        message: (props) => `${props.value} is not a valid name`,
      },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (name) => usernameRegex.test(name),
        message: (props) => `${props.value} is not a valid username`,
      },
    },
    email: {
      type: String,
      unique: [true, 'Email already exists in database!'],
      lowercase: true,
      trim: true,
      index: true,
      required: [true, 'Email is required'],
      validate: {
        validator: (email) => emailRegex.test(email),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required'],
      // validate(value) {
      //   if (value.toLowerCase().includes('password')) {
      //     throw new Error('Password cannot contain "Password"');
      //   }
      // },
      // validate: {
      //   validator: (value) => isPasswordCommon(value),
      //   message: (props) => `${props.value} not a strong password!`,
      // },
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    avatar: {
      type: String,
    },
    notifications: {
      type: Array,
      default: [],
    },

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.password;
  },
});

// UserSchema.set('toJSON', {
//   transform: function(doc, ret, opt) {
//       delete ret['password']
//       return ret
//   }
// })

// UserSchema.methods.toJSON = function(){
//   const user = this;
//   const userObject = user.toObject();
//   delete userObject.password;
//   return userObject;
// }

// UserSchema.methods.toJSON = function() {
//   var obj = this.toObject(); //or var obj = this;
//   delete obj.password;
//   return obj;
//  }

// userSchema.options.toJSON = {
//   transform: (doc, ret) => {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   }
// };

userSchema.pre('remove', function (next) {
  this.model('Order').remove({ owner: this._id }, next);
});

module.exports = mongoose.model('User', userSchema);
