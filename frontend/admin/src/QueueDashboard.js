import React, { useEffect, useState } from 'react';
import { getQueueLengths } from './apiService';

const QueueDashboard = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const data = await getQueueLengths();
        setQueues(data);
      } catch (error) {
        console.error("Failed to fetch queue lengths", error);
      }
    };

    fetchQueues();
  }, []);

  return (
    <div>
      <h1>Queue Dashboard</h1>
      <ul>
        {queues.map(queue => (
          <li key={queue.serviceType}>
            {queue.serviceType}: {queue.length} people waiting
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueueDashboard;
