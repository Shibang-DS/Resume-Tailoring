import { useState, useEffect } from 'react';

export default function StatusView({ jobId, onReset }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">3. Job Status: <span className="uppercase text-blue-600">{job.status}</span></h2>
      
      <div className="mb-4">
        {job.logs && job.logs.map((log, i) => (
          <div key={i} className="text-sm text-gray-600 font-mono">{log}</div>
        ))}
      </div>

      {job.status === 'completed' && job.result && (
        <div className="border-t pt-4 mt-4">
          <h3 className="font-bold mb-2">Result:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold">Changelog</h4>
              <ul className="list-disc pl-5 text-sm">
                {job.result.changelog.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold">Downloads</h4>
              <button className="block w-full text-left text-blue-600 hover:underline mb-2">
                Download PDF (Simulated)
              </button>
              <button className="block w-full text-left text-blue-600 hover:underline">
                Download LaTeX (Simulated)
              </button>
            </div>
          </div>
          <button 
            onClick={onReset}
            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
