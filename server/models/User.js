const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 3, maxlength: 20},
  last_name: { type: String, required: true, minlength: 3, maxlength: 50},
  birthday: { type: Date, required: true,
    validate: {
        validator: function(v) {
          const minimumYear = new Date();
          minimumYear.setFullYear(new Date().getFullYear() - 18);
  
          return v <= minimumYear; 
        },
        message: props => `${props.value}  User must be at least 18 years old.`
      }
  },
  nationality: { type: String, required: true},
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
  mobile: { type: String, required: true,
    match: [/^\+?\d{4,15}$/,'Please enter a valid mobile number'] 
  },
  profile_photo: { type: String, required: true},
  location: {
    country: { type: String, required: true, index : true },
    city: { type: String, required: true, index :true },
    address: { type: String, required: true },
    local_years: { type: Number, required: true, min: 0}
  },
  languages: { 
    name: { type: [String], required: true },
    english_level : { type: String, required: true, enum: ['A1', 'A2', 'B1', 'B2','C1','C2','native']
    }
  },
  passion: {
    interest:{ type: String, required: true, maxlength: 50},
    city_favorite:{ type: String, required: true, maxlength: 50},
    description: { type: String, required: true,  maxlength: 200}
  },
  onboarding: {
    hosted_before: { type: String, required: true },
    guide_license: { type: String, required: true },
    host_impact: { type: String, required: true },
    character_type: { type: String, required: true }
  },
  role: { type: String, enum: ["user", "host"], default: "user" , index: true},
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ first_name: 1, last_name: 1 });  // Compound index for faster lookup on first_name + last_name
UserSchema.index({ "location.city": 1, "location.country": 1 });  // Compound index for city + country in location
UserSchema.index({status: 1 , createdAt: -1});

const User = mongoose.model("User", UserSchema);
module.exports = User;
