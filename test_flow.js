const fs = require('fs');
const path = require('path');

async function runTest() {
  const API_URL = 'http://localhost:3000/api';
  
  // 1. Upload Resume
  console.log('1. Uploading Resume...');
  const formData = new FormData();
  const blob = new Blob([fs.readFileSync('test.tex')], { type: 'application/x-tex' });
  formData.append('resume', blob, 'test.tex');

  const uploadRes = await fetch(`${API_URL}/resumes`, {
    method: 'POST',
    body: formData
  });
  
  if (!uploadRes.ok) {
    console.error('Upload failed:', await uploadRes.text());
    return;
  }
  
  const resume = await uploadRes.json();
  console.log('Resume uploaded:', resume._id);

  // 2. Start Job
  console.log('2. Starting Job...');
  const jobRes = await fetch(`${API_URL}/tailor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resumeId: resume._id,
      jobDescription: 'Looking for a Node.js developer with MongoDB experience.',
      options: { tone: 'concise' }
    })
  });

  if (!jobRes.ok) {
    console.error('Job start failed:', await jobRes.text());
    return;
  }

  const job = await jobRes.json();
  console.log('Job started:', job._id);

  // 3. Poll Status
  console.log('3. Polling Status...');
  let status = 'queued';
  while (status !== 'completed' && status !== 'failed') {
    await new Promise(r => setTimeout(r, 1000));
    const statusRes = await fetch(`${API_URL}/jobs/${job._id}`);
    const statusData = await statusRes.json();
    status = statusData.status;
    console.log('Status:', status);
  }

  console.log('Final Status:', status);
}

runTest().catch(console.error);
