module.exports = ({ env }) => ({
    "record-locking": {
       enabled: true,
     },
     email: {
        config: {
          provider: 'sendgrid',
          providerOptions: {
            apiKey: env('SENDGRID_API_KEY'),
          },
          settings: {
            defaultFrom: 'admin@breezy-book.com',
            defaultReplyTo: 'admin@breezy-book.com',
          },
        },
      },
   });