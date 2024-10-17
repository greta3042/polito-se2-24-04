import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// Counter Charts
const CounterDayChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.numCustomers),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const CounterWeekChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.week),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.numCustomers),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const CounterMonthChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.numCustomers),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

// Service Charts
const ServiceDayChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.totalCustomers),
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const ServiceWeekChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.week),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.totalCustomers),
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const ServiceMonthChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.totalCustomers),
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const CounterServiceDayChart = ({ data }) => {
    // Assuming data is an array of objects with counterId, serviceName, date, and totalCustomers fields
    const counters = [...new Set(data.map(item => item.counterId))]; // Unique counters
    const services = [...new Set(data.map(item => item.serviceName))]; // Unique services
  
    const chartData = {
      labels: data.map(item => item.date), // Assuming all items have the same dates
      datasets: counters.flatMap(counter =>
        services.map(service => ({
          label: `Counter ${counter} - Service ${service}`,
          data: data
            .filter(item => item.counterId === counter && item.serviceName === service)
            .map(item => item.totalCustomers),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 1,
        }))
      ),
    };
  
    return <Bar data={chartData} />;
  };

const CounterServiceWeekChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.week),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.totalCustomers),
        backgroundColor: 'rgba(255,159,64,0.4)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const CounterServiceMonthChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Customers',
        data: data.map(item => item.totalCustomers),
        backgroundColor: 'rgba(255,159,64,0.4)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export {
  CounterDayChart,
  CounterWeekChart,
  CounterMonthChart,
  ServiceDayChart,
  ServiceWeekChart,
  ServiceMonthChart,
  CounterServiceDayChart,
  CounterServiceWeekChart,
  CounterServiceMonthChart,
};