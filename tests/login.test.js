const { response } = require('express');
const { logIn } = require('../user/controller');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {User} = require("../user/model");

// Mocking dependencies
jest.mock('../user/model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('logIn function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Reset mocks for each test
        jest.clearAllMocks();
        User.findOne = jest.fn();
        User.findOne.mockResolvedValue({
            email: req.body.email,
            password: '$2b$10$EXAMPLE_HASH',
        });

        // Mock implementation for bcrypt compare

        bcrypt.compare = jest.fn();
        bcrypt.compare.mockResolvedValue(true);

        // Mock implementation for jwt sign
        jwt.sign = jest.fn(() => 'mockedToken');
    });

    test('should return success message and token if credentials are valid', async () => {
        await logIn(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mockedToken' });
    });

    test('should return error message if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        await logIn(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    test('should return error message if password is incorrect', async () => {
        bcrypt.compare.mockResolvedValue(false);

        await logIn(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    test('should return error message if an error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await logIn(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});
