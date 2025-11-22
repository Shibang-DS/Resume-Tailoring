const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  jobDescription: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['queued', 'processing', 'completed', 'failed'], 
    default: 'queued' 
  },
  options: {
    tone: { type: String, default: 'concise' },
    focus: { type: String },
    strictness: { type: String, default: 'light' }
  },
  result: {
    texPath: String,
    pdfPath: String,
    changelog: [String],
    diff: String
  },
  logs: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
