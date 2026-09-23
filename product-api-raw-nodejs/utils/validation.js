function validateProduct(data) {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Name is required and must be a string";
  }

  if (typeof data.price !== "number" || data.price <= 0) {
    errors.price = "Price must be a number greater than 0";
  }

  if (typeof data.categoryId !== "number" || data.categoryId <= 0) {
    errors.categoryId = "Category ID must be a valid number";
  }

  if (typeof data.stock !== "number" || data.stock < 0) {
    errors.stock = "Stock must be a number greater than or equal to 0";
  }

  return errors;
}

module.exports = { validateProduct };
