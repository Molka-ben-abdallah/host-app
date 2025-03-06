const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  theme: { type: String, index: true },
  title: { type: String, minlength: 5, maxlength: 40, index : true },
  description: { type: String, minlength: 10, maxlength: 300 },
  duration : {type : String , required : true},
  provision :{
    items : [String], 
    not_providing : { type: Boolean, default: false },
    transport : String,
    vehicle_operator : String
  },
  requirements: { 
    minimum_age : {type: Number , required : true},
    kids_under2: { type: Boolean, default: false },
    accessibility : String,
    activity_level : {type: String, required : true},
    skill_level : {type: String, required : true}
   },
  location: {
    meeting_place : { 
      country: { type: String },
      street_address: { type: String },
      city: { type: String },
      state: { type: String },
      zip_code: { type: String }
    },
    trip_location : {type : String , index: true }
  },
  photos: { type: [String]},
  group_size: {
    public: { type: Number, min: 4 },
    private: { type: Number, min: 4, max : 25 }
  },
  availability: 
    {
      date: { type: Date, index: true },
      start_time: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }
    },
  pricing: {
    per_person: { type: Number, min: 0 },
    per_instance: { type: Number, min : 0 }
  },
  booking: { 
   cutoff_time : {type : String , required : true},
   request_availability : Boolean
  },
  review : {
    license_status : {type : String, required : true},
    local_laws :{ type: Boolean, default: false },
    description_accuracy : { type: Boolean, default: false },
    agrees_to_term : { type: Boolean, default: false }
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index : true },
  createdAt: { type: Date, default: Date.now , index: true}
});

TripSchema.index({ hostId: 1, createdAt: -1 }); // Filter by host and sort by newest
TripSchema.index({ theme: 1, availability: 1 }); // Filter by theme and date
TripSchema.index({ status: 1, createdAt: -1 });

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;
