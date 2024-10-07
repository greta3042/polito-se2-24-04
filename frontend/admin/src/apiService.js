import axios from 'axios';

// Set backend API
const BASE_URL = 'http://backend-api-url.com/api';

//fetch queue lengths for all services
export const getQueueLengths = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/queues`);
    return response.data;
  } catch (error) {
    console.error("Error fetching queue lengths", error);
    throw error;
  }
};

// Function to call next client for a given counter
export const callNextClient = async (counterId) => {
  try {
    const response = await axios.post(`${BASE_URL}/counters/${counterId}/next`);
    return response.data;
  } catch (error) {
    console.error("Error calling next client", error);
    throw error;
  }
};

// Function to get waiting time estimate for a given ticket
export const getWaitTimeEstimate = async (ticketCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/tickets/${ticketCode}/wait-time`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wait time estimate", error);
    throw error;
  }
};
