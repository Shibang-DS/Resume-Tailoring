const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const tailorQueue = require('../queue');

// POST /api/tailor
router.post('/', async (req, res) => {
  try {
    const { resumeId, jobDescription, options } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ error: 'resumeId and jobDescription are required' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const job = new Job({
      resumeId,
      jobDescription,
      options,
      status: 'queued'
    });

    await job.save();

    // Add to Bull Queue
    await tailorQueue.add({
      jobId: job._id,
      resumeId: resume._id,
      resumePath: resume.path,
      jobDescription,
      options
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ error: 'Failed to create tailoring job' });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('resumeId');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

module.exports = router;
