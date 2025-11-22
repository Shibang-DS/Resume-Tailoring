import { useState } from 'react';
import UploadSection from './components/UploadSection';
import JobInput from './components/JobInput';
import StatusView from './components/StatusView';

function App() {
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState(null);

  const handleReset = () => {
    setResume(null);
    setJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Resume Tailor</h1>
          <p className="text-gray-600">AI-powered LaTeX resume customization</p>
        </header>

        {!resume && (
          <UploadSection onUploadComplete={setResume} />
        )}

        {resume && !job && (
          <JobInput resumeId={resume._id} onJobCreated={setJob} />
        )}

        {job && (
          <StatusView jobId={job._id} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
