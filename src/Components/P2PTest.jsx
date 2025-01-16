import React, { useEffect, useState } from 'react';
import testP2PMessaging from '../utils/p2pTest';

const P2PTest = () => {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const runTest = async () => {
      try {
        setStatus('Running tests...');
        await testP2PMessaging();
        setStatus('Tests completed! Check console for details.');
      } catch (error) {
        console.error('Test failed:', error);
        setStatus('Tests failed! Check console for details.');
      }
    };

    runTest();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">P2P Messaging Test</h1>
      <p className="mb-2">Status: {status}</p>
      <p>Check the browser console for detailed test results</p>
    </div>
  );
};

export default P2PTest; 