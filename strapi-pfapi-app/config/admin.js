module.exports = ({ env }) => ({
// Replace the Strapi logo in auth (login) views
auth: {
  secret: env('ADMIN_JWT_SECRET'),
  //logo: './extensions/favicon.png',
},
apiToken: {
  salt: env('API_TOKEN_SALT'),
},
transfer: {
  token: {
    salt: env('TRANSFER_TOKEN_SALT'),
  },
},
// Replace the favicon
// head: {
//   favicon: favicon,
// },
// Add a new locale, other than 'en'
locales: ['fr', 'de'],
// Replace the Strapi logo in the main navigation
menu: {
//logo: './extensions/favicon.png',
},
// Override or extend the theme
theme: {
colors: {
  alternative100: '#f6ecfc',
  alternative200: '#e0c1f4',
  alternative500: '#ac73e6',
  alternative600: '#9736e8',
  alternative700: '#8312d1',
  danger700: '#b72b1a'
},
},
// Extend the translations
//translations: {
//  fr: {
//    'Auth.form.email.label': 'test',
//    Users: 'Utilisateurs',
//    City: 'CITY (FRENCH)',
  // Customize the label of the Content Manager table.
//    Id: 'ID french',
//  },
//},
// Disable video tutorials
tutorials: true,
// Disable notifications about new Strapi releases
notifications: { release: false },
});