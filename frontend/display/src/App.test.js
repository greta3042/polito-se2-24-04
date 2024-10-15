// App.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';  
import App from './App';
import { act } from 'react-dom/test-utils';
import io from 'socket.io-client';


jest.mock('socket.io-client');

describe('App Component', () => {
  let socketMock;

  beforeEach(() => {
    
    socketMock = {
      on: jest.fn((event, callback) => {
        if (event === 'nextCustomer') {
          act(() => {
            callback({
              customerNumber: 'A1',
              service: 'Service1',
              counterId: 'C1',
            });
          });
        }
      }),
      disconnect: jest.fn(),
    };

    // Mock the `io` function from socket.io-client to return the mocked socket
    io.mockReturnValue(socketMock);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clear mocks between tests
  });

  test('renders table with headers', () => {
    render(<App />);
    
    // Check if the table headers are rendered
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Counter')).toBeInTheDocument();
  });

  test('renders a notification row when socket receives data', async () => {
    render(<App />);

    // Expect that a row with the customerNumber, service, and counter is rendered
    expect(await screen.findByText('A1')).toBeInTheDocument();
    expect(await screen.findByText('Service1')).toBeInTheDocument();
    expect(await screen.findByText('C1')).toBeInTheDocument();
  });
});
