const { getUserProfile } = require('../user/controller');
const User = require('../user/model');

jest.mock('../user/model');

describe('getUserProfile function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'userId',
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Reset mocks for each test
    jest.clearAllMocks();
  });

  test('should return user profile if user is found', async () => {
    const user = {
      _id: 'userId',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    };

    User.findOne.mockResolvedValue(user);

    await getUserProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    expect(res.json).toHaveBeenCalledWith({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  });

  test('should return 404 error if user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await getUserProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return 500 error if an error occurs', async () => {
    const errorMessage = 'Internal Server Error';
    User.findOne.mockRejectedValue(new Error(errorMessage));

    await getUserProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
