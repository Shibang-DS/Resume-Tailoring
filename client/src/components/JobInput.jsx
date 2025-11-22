import { useState } from 'react';

export default function JobInput({ resumeId, onJobCreated }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jobDescription) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          jobDescription,
          options: { tone: 'concise' } // Default options for MVP
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onJobCreated(data);
      } else {
        alert('Failed to start job: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">2. Job Description</h2>
      <textarea
        className="w-full h-40 p-3 border rounded-md mb-4"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button 
        onClick={handleSubmit}
        disabled={!jobDescription || loading}
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 w-full"
      >
        {loading ? 'Starting Job...' : 'Tailor Resume'}
      </button>
    </div>
  );
}
