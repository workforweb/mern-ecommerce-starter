const validateForm = (value) => {
  const errors = {};

  if (value.address.length === 0) {
    errors.address = 'address is rquired!';
  } else if (value.address.length < 2) {
    errors.address = 'address must be more that 2 characters!';
  } else if (!value.address.match(/^[A-Za-z0-9? ,-]+$/)) {
    errors.address = 'This is not a valid address!';
  }

  if (value.city.length === 0) {
    errors.city = 'city is rquired!';
  } else if (value.city.length < 2) {
    errors.city = 'city must be more that 2 characters!';
  } else if (!value.city.match(/^[a-zA-Z]*$/)) {
    errors.city = 'This is not a valid city name!';
  }

  if (value.state.length === 0) {
    errors.state = 'state is rquired!';
  } else if (value.state.length < 2) {
    errors.state = 'state must be more that 2 characters!';
  } else if (!value.state.match(/^[a-zA-Z]*$/)) {
    errors.state = 'This is not a valid state name!';
  }

  if (value.country.length === 0) {
    errors.country = 'country is rquired!';
  } else if (value.country.length < 2) {
    errors.country = 'country must be more that 2 characters!';
  } else if (!value.country.match(/^[a-zA-Z]*$/)) {
    errors.country = 'This is not a valid country name!';
  }

  if (value.pincode.length === 0) {
    errors.pincode = 'pincode is rquired!';
  } else if (value.pincode.length < 6) {
    errors.pincode = 'pincode must be 6 characters long!';
  } else if (!value.pincode.match(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/)) {
    errors.pincode = 'This is not a valid pincode!';
  }

  if (value.phone.length === 0) {
    errors.phone = 'phone is rquired!';
  } else if (value.phone.length < 10) {
    errors.phone = 'phone must be more that 10 characters!';
  } else if (!value.phone.match(/^[0]?[789]\d{9}$/)) {
    errors.phone = 'This is not a valid phone number!';
  }

  return errors;
};

export default validateForm;
