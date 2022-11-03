export const getCookie = (key) => {
  // key = document.cookie's Name
  const value = document.cookie;
  const valueSplit = value.split('; ');
  const valueFind = valueSplit.find((x) => x.startsWith(key + '='));
  if (valueFind) return valueFind.split('=')[1];
};

export const getInitials = (fullName) => {
  const readNameInParts = fullName.trim().split(' ');
  const initials = readNameInParts.reduce((acc, curr, index) => {
    if (index === 0 || index === readNameInParts.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
};
