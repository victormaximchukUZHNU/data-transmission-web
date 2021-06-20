export default () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://data-transmission-api.herokuapp.com';
  }

  return window.location.origin.replace('8080', '3000');
};
