const countryList = require('country-list');

// country list with USA at the top
const USA = 'United States of America';
const countries = countryList.getNames().sort();
countries.splice(countries.indexOf(USA), 1);
countries.unshift(USA);

function retrieveProfile(ctx) {
  ctx.state.countries = countries;
  return ctx.render('my-account/profile');
}

module.exports = retrieveProfile;
