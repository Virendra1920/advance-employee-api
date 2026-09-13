const validateData = (schema) => (req, res, next) => {
  try {
    // Parse and validate the incoming request body
    schema.parse(req.body);
    next(); // If validation passes, move to the next middleware or controller
  } catch (error) {
    // If validation fails, extract and format the exact errors
    const formattedErrors = error.errors.map((err) => ({
      field: err.path[0], // The exact field where the error occurred
      issue: err.message  // The specific error message
    }));

    return res.status(400).json({
      status: "Fail",
      message: "Validation failed. Please check the provided data.",
      errors: formattedErrors
    });
  }
};

module.exports = { validateData };