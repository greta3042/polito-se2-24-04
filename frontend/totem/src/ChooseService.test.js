import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import ChooseService from './ChooseService';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders the ChooseService component with service buttons', () => {
  render(
    <MemoryRouter>
      <ChooseService />
    </MemoryRouter>
  );

  // Check if the service buttons are rendered
  const serviceButtons = screen.getAllByRole('button');
  expect(serviceButtons).toHaveLength(4); 
  expect(screen.getByText('Choose a Service')).toBeInTheDocument(); 
});

test('clicking a service button triggers ticket generation', async () => {
  
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ticketNumber: 'A123' }),
  });

  render(
    <MemoryRouter>
      <ChooseService />
    </MemoryRouter>
  );

  const serviceButton = screen.getByText('Service 1');
  fireEvent.click(serviceButton);

  
  expect(screen.getByText(/Generating your ticket.../i)).toBeInTheDocument();

  
  await waitFor(() =>
    expect(screen.getByText(/Your ticket number is:/i)).toBeInTheDocument()
  );
  await waitFor(() => expect(screen.getByText(/A123/i)).toBeInTheDocument());

 
  expect(screen.getByText('You selected: Service 1')).toBeInTheDocument();
});

test('displays error message when API call fails', async () => {
  
  fetch.mockRejectedValueOnce(new Error('Failed to generate ticket. Please try again.'));

  render(
    <MemoryRouter>
      <ChooseService />
    </MemoryRouter>
  );

  const serviceButton = screen.getByText('Service 1');
  fireEvent.click(serviceButton);

  await waitFor(() =>
    expect(screen.getByText('Failed to generate ticket. Please try again.')).toBeInTheDocument()
  );
});

test('disables service buttons while loading', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ticketNumber: 'A123' }),
  });

  render(
    <MemoryRouter>
      <ChooseService />
    </MemoryRouter>
  );

  const serviceButton = screen.getByText('Service 1');
  fireEvent.click(serviceButton);

  expect(serviceButton).toBeDisabled();

  await waitFor(() => screen.getByText(/A123/i));
  expect(serviceButton).not.toBeDisabled();
});
