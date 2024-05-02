const { signUp } = require('../user/controller');
const User = require('../user/model');
const bcrypt = require('bcryptjs');

jest.mock('../user/model');
jest.mock('bcryptjs');

describe('signUp function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                phone: '123456789',
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
    });

    test('should create a new user and return success message', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        const savedUser = { ...req.body, _id: 'userId' }; // Initialize with the request body, without an _id

        // Mock the save method of the user object
        const saveMock = jest.fn().mockResolvedValue(savedUser);
        const userInstanceMock = { save: saveMock };
        User.mockReturnValueOnce(userInstanceMock);

        await signUp(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
        expect(User).toHaveBeenCalledWith({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: 'hashedPassword',
        });

        // Ensure that the save method is called
        expect(saveMock).toHaveBeenCalled();

        // Ensure that the response contains a user_id
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User signed up successfully!' }));
        // expect(res.json.mock.calls[0][0].user_id).toBeDefined(); // Ensure that user_id is defined in the response
    });


    test('should return error message if email already exists', async () => {
        User.findOne.mockResolvedValue({ email: req.body.email });

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    test('should return error message if an error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});
