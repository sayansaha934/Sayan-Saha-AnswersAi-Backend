const { getQueryById } = require('../question/controller');
const Question = require('../question/model');

jest.mock('../question/model');

describe('getQueryById function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'questionId',
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Reset mocks for each test
    jest.clearAllMocks();
  });

  test('should return query and result for the given question id', async () => {
    const question = {
      _id: 'questionId',
      query: 'Test question',
      result: 'Test answer',
    };

    // Mocking the findOne method of the Question model to return the question
    Question.findOne.mockResolvedValue(question);

    await getQueryById(req, res);

    expect(Question.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    expect(res.json).toHaveBeenCalledWith({
      query: question.query,
      result: question.result,
    });
  });

  test('should return 404 error if question is not found', async () => {
    // Mocking the findOne method of the Question model to return null
    Question.findOne.mockResolvedValue(null);

    await getQueryById(req, res);

    expect(Question.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Query not found' });
  });

  test('should return 500 error if an error occurs', async () => {
    const errorMessage = 'Internal Server Error';
    // Mocking the findOne method of the Question model to throw an error
    Question.findOne.mockRejectedValue(new Error(errorMessage));

    await getQueryById(req, res);

    expect(Question.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
