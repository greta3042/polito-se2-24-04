import React, { useState } from 'react';
import {
  CounterDayChart,
  CounterWeekChart,
  CounterMonthChart,
  ServiceDayChart,
  ServiceWeekChart,
  ServiceMonthChart,
  CounterServiceDayChart,
  CounterServiceWeekChart,
  CounterServiceMonthChart,
} from './Histograms';
import './Homepage.css';

const Homepage = ({ setData, data }) => {
  const [step, setStep] = useState(1);
  const [statType, setStatType] = useState(null);
  const [timeFrame, setTimeFrame] = useState(null);

// Define backend functions for counters
const fetchCounterDayStats = async () => {
  const response = await fetch('http://localhost:3001/api/statistics/getCustomersForEachCounterByDay');
  const data = await response.json();
  setData(data);
};

const fetchCounterWeekStats = async () => {
  const response = await fetch('http://localhost:3001/api/statistics/getCustomersForEachCounterByWeek');
  const data = await response.json();
  setData(data);
};

const fetchCounterMonthStats = async () => {
  const response = await fetch('http://localhost:3001/api/statistics/getCustomersForEachCounterByMonth');
  const data = await response.json();
  setData(data);
};

// Define backend functions for services
const fetchServiceDayStats = async () => {
  const response = await fetch('http://localhost:3001/api/statistics/customersForServiceByDay');
  const data = await response.json();
  setData(data);
};

const fetchServiceWeekStats = async () => {
  const response = await fetch('http://localhost:3001/api/statistics/customersForServiceByWeek');
  const data = await response.json();
  setData(data);
};

const fetchServiceMonthStats = async () => {
  const response = await fetch('http://localhost:3001/api/statistics/customersForServiceByMonth');
  const data = await response.json();
  setData(data);
};

// Define backend functions for services
const fetchCounterServiceDayStats = async () => {
  const response = await fetch('http://localhost:3001/api/getDailyCustomersForEachCounterByService');
  const data = await response.json();
  setData(data);
};

const fetchCounterServiceWeekStats = async () => {
  const response = await fetch('http://localhost:3001/api/getWeeklyCustomersForEachCounterByService');
  const data = await response.json();
  setData(data);
};

const fetchCounterServiceMonthStats = async () => {
  const response = await fetch('http://localhost:3001/api/getMonthlyCustomersForEachCounterByService');
  const data = await response.json();
  setData(data);
};

const handleStatTypeClick = (type) => {
  setStatType(type);
  setStep(2);
};

const handleBackClick = () => {
  setStep(1);
  setStatType(null);
  setData(null);
};


// Modify handleTimeFrameClick function
const handleTimeFrameClick = (timeFrame, statType) => {
  setTimeFrame(timeFrame);
  if (statType === 'counter') {
    switch (timeFrame) {
      case 'day':
        fetchCounterDayStats();
        break;
      case 'week':
        fetchCounterWeekStats();
        break;
      case 'month':
        fetchCounterMonthStats();
        break;
      default:
        console.error('Invalid time frame');
    }
  } else if (statType === 'service') {
    switch (timeFrame) {
      case 'day':
        fetchServiceDayStats();
        break;
      case 'week':
        fetchServiceWeekStats();
        break;
      case 'month':
        fetchServiceMonthStats();
        break;
      default:
        console.error('Invalid time frame');
    }
  }  else if (statType === 'both') {
    switch (timeFrame) {
      case 'day':
        fetchCounterServiceDayStats();
        break;
      case 'week':
        fetchCounterServiceWeekStats();
        break;
      case 'month':
        fetchCounterServiceMonthStats();
        break;
      default:
        console.error('Invalid time frame');
    }
  }else {
    console.error('Invalid stat type');
  }
};

return (
  <div>
    <h1>Counter Statistics</h1>
    {step === 1 && (
      <div className="button-group">
        <button onClick={() => handleStatTypeClick('counter')}>See stats by counter</button>
        <button onClick={() => handleStatTypeClick('service')}>See stats by service</button>
        <button onClick={() => handleStatTypeClick('both')}>See stats by both</button>
      </div>
    )}
    {step === 2 && (
      <div className="button-group">
      {statType === 'counter' && (
        <>
          <button onClick={() => handleTimeFrameClick('day', 'counter')}>Day (Counter)</button>
          <button onClick={() => handleTimeFrameClick('week', 'counter')}>Week (Counter)</button>
          <button onClick={() => handleTimeFrameClick('month', 'counter')}>Month (Counter)</button>
        </>
      )}
      {statType === 'service' && (
        <>
          <button onClick={() => handleTimeFrameClick('day', 'service')}>Day (Service)</button>
          <button onClick={() => handleTimeFrameClick('week', 'service')}>Week (Service)</button>
          <button onClick={() => handleTimeFrameClick('month', 'service')}>Month (Service)</button>
        </>
      )}
      {statType === 'both' && (
        <>
          <button onClick={() => handleTimeFrameClick('day', 'both')}>Day (CounterService)</button>
          <button onClick={() => handleTimeFrameClick('week', 'both')}>Week (CounterService)</button>
          <button onClick={() => handleTimeFrameClick('month', 'both')}>Month (CounterService)</button>
        </>
        )}
        <button onClick={handleBackClick}>Back</button>
      </div>
    )}
      <div className="data-section">
        {data ? (
          statType === 'counter' ? (
            timeFrame === 'day' ? (
              <CounterDayChart data={data} />
            ) : timeFrame === 'week' ? (
              <CounterWeekChart data={data} />
            ) : timeFrame === 'month' ? (
              <CounterMonthChart data={data} />
            ) : null
          ) : statType === 'service' ? (
            timeFrame === 'day' ? (
              <ServiceDayChart data={data} />
            ) : timeFrame === 'week' ? (
              <ServiceWeekChart data={data} />
            ) : timeFrame === 'month' ? (
              <ServiceMonthChart data={data} />
            ) : null
          ) : statType === 'both' ? (
            timeFrame === 'day' ? (
              <CounterServiceDayChart data={data} />
            ) : timeFrame === 'week' ? (
              <CounterServiceWeekChart data={data} />
            ) : timeFrame === 'month' ? (
              <CounterServiceMonthChart data={data} />
            ) : null
          ) : null
        ) : (
          <p>No data available</p>
        )}
      </div>
  </div>
);
};

export default Homepage;