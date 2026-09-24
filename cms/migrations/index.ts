import * as migration_20260924_170255_initial_schema from './20260924_170255_initial_schema';
import * as migration_20260924_174342_add_approval_gates from './20260924_174342_add_approval_gates';
import * as migration_20260924_175255_add_media_published from './20260924_175255_add_media_published';

export const migrations = [
  {
    up: migration_20260924_170255_initial_schema.up,
    down: migration_20260924_170255_initial_schema.down,
    name: '20260924_170255_initial_schema',
  },
  {
    up: migration_20260924_174342_add_approval_gates.up,
    down: migration_20260924_174342_add_approval_gates.down,
    name: '20260924_174342_add_approval_gates',
  },
  {
    up: migration_20260924_175255_add_media_published.up,
    down: migration_20260924_175255_add_media_published.down,
    name: '20260924_175255_add_media_published'
  },
];
