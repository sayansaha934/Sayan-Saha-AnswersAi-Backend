const { getQueriesByUserId } = require('../question/controller');
const Question = require('../question/model');

jest.mock('../question/model');

describe('getQueriesByUserId function', () => {
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

  test('should return questions for the given user id', async () => {
    const questions = [
      { _id: 'questionId1', query: 'Question 1' },
      { _id: 'questionId2', query: 'Question 2' },
    ];

    // Mocking the find method of the Question model to return questions
    Question.find.mockReturnValue({ select: jest.fn().mockResolvedValue(questions) });

    await getQueriesByUserId(req, res);

    expect(Question.find).toHaveBeenCalledWith({ user_id: req.params.id });
    expect(res.json).toHaveBeenCalledWith(questions);
  });

  test('should return 500 error if an error occurs', async () => {
    const errorMessage = 'Internal Server Error';
    
    // Mocking the find method of the Question model to return a rejected promise with the error message
    Question.find.mockImplementation(() => {
      throw new Error(errorMessage);
    });
  
    await getQueriesByUserId(req, res);
  
    expect(Question.find).toHaveBeenCalledWith({ user_id: req.params.id });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
  
});
