// Code copied (with some modifications) from the Keystone 6 "with-auth" example
// See.. https://github.com/keystonejs/keystone/tree/master/examples/with-auth

import { config } from '@keystone-6/core';
import { lists } from './schema';
import { PORT, DATABASE_URL } from './config';
import { withAuth, session } from './auth';

// We wrap our config using the withAuth function. This will inject all
// the extra config required to add support for authentication in our system.
export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url: DATABASE_URL,
    },
    server: { port: PORT },
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    // We add our session configuration to the system here.
    session,
  })
);
