export default () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://data-transmission-api.herokuapp.com';
  }

  return 'http://localhost:3000';
};
