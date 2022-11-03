const emailRegex =
  /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

// const priceRegex = /^\d+(\.\d{1,2})?$/;
const priceRegex = /(?=[^\0])(?=^([0-9]+){0,1}(\.[0-9]{1,2}){0,1}$)/;

exports.validateRegisterInput = (name, username, email, password) => {
  const errors = [];
  if (name?.trim() === '') {
    errors.push('Name must not be empty');
  }
  if (username.trim() === '') {
    errors.push('Username must not be empty');
  }
  if (email?.trim() === '') {
    errors.push('Email must not be empty');
  } else if (!email.match(emailRegex)) {
    errors.push('Email must be a valid email address');
  }

  if (password === '') {
    errors.push('Password must not empty');
  } else if (password.length < 8) {
    errors.push('Password atleast 8 characters long');
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

exports.validateLoginInput = (email, password) => {
  const errors = [];

  if (email?.trim() === '') {
    email = 'Email must not be empty';
    errors.push(email);
  } else if (!email.match(emailRegex)) {
    email = 'Email must be a valid email address';
    errors.push(email);
  }

  if (password === '') {
    password = 'Password must not empty';
    errors.push(password);
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

exports.validateProductsInput = (name, description, price, category) => {
  const errors = [];

  if (name?.trim() === '') {
    errors.push('Name must not be empty');
  }

  if (description?.trim() === '') {
    errors.push('Description must not be empty');
  }

  if (price?.trim() === '') {
    errors.push('Price must not be empty');
  } else if (!price.match(priceRegex)) {
    price = 'Price must be in number format';
    errors.push(price);
  }

  if (category?.trim() === '') {
    errors.push('Category must not empty');
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};
