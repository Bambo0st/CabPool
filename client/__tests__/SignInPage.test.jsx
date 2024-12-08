import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignInPage from '../src/components/SignInPage.jsx';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../src/context/UserContext', () => ({
    useUserContext: () => ({
        user: null,  // No user initially
        setUser: jest.fn(),  // Mock the setUser function
    }),
}));

describe('SignInPage', () => {

    test('renders the sign-in form with all fields', () => {
        render(
            <Router>
                <SignInPage />
            </Router>
        );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('handles user input correctly', () => {
        render(
            <Router>
                <SignInPage />
            </Router>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('displays error when login fails', async () => {
        render(
            <Router>
                <SignInPage />
            </Router>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /sign in/i });

        // Simulate user typing in email and password
        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

        global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => ({ message: 'Invalid credentials' }) });

        // Click the login button
        fireEvent.click(loginButton);

        const errorMessage = await screen.findByText(/invalid credentials/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
