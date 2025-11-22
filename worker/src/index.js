require('dotenv').config();
const Queue = require('bull');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs-extra');

// Import Models (Directly from server for MVP)
const Job = require('../../server/src/models/Job');
const Resume = require('../../server/src/models/Resume');

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Worker connected to MongoDB'))
  .catch(err => console.error('Worker MongoDB connection error:', err));

const tailorQueue = new Queue('tailor-queue', process.env.REDIS_URI || 'redis://localhost:6379');

tailorQueue.process(async (job) => {
  console.log(`Processing job ${job.id}`);
  const { jobId, resumeId, jobDescription, options } = job.data;

  try {
    // Update status to processing
    await Job.findByIdAndUpdate(jobId, { status: 'processing' });

    // Simulate LLM Processing
    console.log('Simulating LLM tailoring...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate Compilation
    console.log('Simulating LaTeX compilation...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create dummy result
    const result = {
      texPath: 'dummy/path/to/tailored.tex',
      pdfPath: 'dummy/path/to/tailored.pdf',
      changelog: ['Updated summary', 'Added Node.js to skills'],
      diff: 'Diff content here...'
    };

    // Update status to completed
    await Job.findByIdAndUpdate(jobId, { 
      status: 'completed',
      result: result,
      logs: ['Job started', 'LLM processing done', 'Compilation done']
    });

    console.log(`Job ${jobId} completed`);
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    await Job.findByIdAndUpdate(jobId, { 
      status: 'failed',
      logs: ['Job failed: ' + error.message]
    });
    throw error;
  }
});

console.log('Worker started, listening for jobs...');
