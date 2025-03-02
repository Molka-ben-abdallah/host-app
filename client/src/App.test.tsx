import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { getTest } from './functions/workout';

// Mock the getTest function
jest.mock('./functions/workout', () => ({
  getTest: jest.fn(),
}));

test('renders the initial text and updates after API call', async () => {
  // Mock the resolved value of getTest
  (getTest as jest.Mock).mockResolvedValue({ message: 'Updated text' });

  render(<App />);

  // Check if the initial text is rendered
  const initialHeading = screen.getByText(/hello world/i);
  expect(initialHeading).toBeInTheDocument();

  // Wait for the state to update and check the new text
  await waitFor(() => {
    const updatedHeading = screen.getByText(/updated text/i);
    expect(updatedHeading).toBeInTheDocument();
  });
});