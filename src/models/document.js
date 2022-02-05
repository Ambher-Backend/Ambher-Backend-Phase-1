const mongoose = require("mongoose");

const DocumentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bucketPath: {
      type: String,
      required: true,
      unique: true,
    },
    privateLink: {
      type: String,
      required: true,
      unique: true,
    },
    publicLink: {
      type: String,
      required: true,
      unique: true,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// This validator is trimming all the fields and is removing special characters from file names.
// Used function because pre method doesn't support arrow functions as call back.
DocumentSchema.pre("save", function(next) {
  for (const key in this) {
    if (typeof this[key] == "string") {
      this[key] = this[key].trim();
    }
  }
  this.name = this.name.replace(/^A-Za-z0-9_-/, "_");
  next();
});

const document = mongoose.model("Document", DocumentSchema);

module.exports = document;
