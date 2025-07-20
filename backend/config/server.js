module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'), // Default host for Strapi
  port: env.int('PORT', process.env.PORT || 1337), // Vercel will assign a port dynamically, fallback to 1337
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
