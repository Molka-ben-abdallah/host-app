const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  password : {type: String , required: true},
  
  first_name: { type: String, minlength: 3, maxlength: 20},
  last_name: { type: String, minlength: 3, maxlength: 50},
  birthday: { type: Date,
    validate: {
        validator: function(v) {
          const minimumYear = new Date();
          minimumYear.setFullYear(new Date().getFullYear() - 18);
  
          return v <= minimumYear; 
        },
        message: props => `${props.value}  User must be at least 18 years old.`
      }
  },
  nationality: { type: String},
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
  mobile: { type: String,
    match: [/^\+?\d{4,15}$/,'Please enter a valid mobile number'] 
  },
  profile_photo: { type: String},
  location: {
    country: { type: String, index : true },
    city: { type: String, index :true },
    address: { type: String },
    local_years: { type: Number, min: 0}
  },
  languages: { 
    name: { type: [String] },
    english_level : { type: String, enum: ['A1', 'A2', 'B1', 'B2','C1','C2','native']
    }
  },
  passion: {
    interest:{ type: String, maxlength: 50},
    city_favorite:{ type: String, maxlength: 50},
    description: { type: String,  maxlength: 200}
  },
  onboarding: {
    hosted_before: { type: String },
    guide_license: { type: String },
    host_impact: { type: String },
    character_type: { type: String }
  },
  role: { type: String, enum: ["user", "host"], default: "user" , index: true},
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
},{timestamps: true});

UserSchema.index({ first_name: 1, last_name: 1 });  
UserSchema.index({ "location.city": 1, "location.country": 1 }); 
UserSchema.index({status: 1 , createdAt: -1});

const User = mongoose.model("User", UserSchema);
module.exports = User;
