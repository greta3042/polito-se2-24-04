import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ChooseService from './ChooseService';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders the ChooseService component with service buttons', () => {
  render(<ChooseService />);
  
  // Check if the service buttons are rendered
  const serviceButtons = screen.getAllByRole('button');
  expect(serviceButtons).toHaveLength(4); // Expect 4 service buttons
  expect(screen.getByText('Choose a Service')).toBeInTheDocument(); // Check the title
});

test('clicking a service button triggers ticket generation', async () => {
  // Mock successful response from the fetch API
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ticketNumber: 'A123' }),
  });

  render(<ChooseService />);

  const serviceButton = screen.getByText('Service 1');
  fireEvent.click(serviceButton);

  // Check if the loading message is displayed
  expect(screen.getByText(/Generating your ticket.../i)).toBeInTheDocument();

  // Wait for the ticket info to appear using regular expressions
  await waitFor(() => expect(screen.getByText(/Your ticket number is:/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText(/A123/i)).toBeInTheDocument());

  // Also check the selected service text
  expect(screen.getByText('You selected: Service 1')).toBeInTheDocument();
});

test('displays error message when API call fails', async () => {
  // Mock a failed API response
  fetch.mockRejectedValueOnce(new Error('Failed to generate ticket. Please try again.'));

  render(<ChooseService />);

  const serviceButton = screen.getByText('Service 1');
  fireEvent.click(serviceButton);

  
  await waitFor(() => expect(screen.getByText('Failed to generate ticket. Please try again.')).toBeInTheDocument());
});

test('disables service buttons while loading', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ticketNumber: 'A123' }),
  });

  render(<ChooseService />);

  const serviceButton = screen.getByText('Service 1');
  fireEvent.click(serviceButton);

  
  expect(serviceButton).toBeDisabled();

  await waitFor(() => screen.getByText(/A123/i));
  expect(serviceButton).not.toBeDisabled();
});
