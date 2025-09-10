import { AppDataSource } from '../src/data-source';

async function main() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  // Fix roles: convert JSON array strings to comma-separated values
  await manager.query(`
    UPDATE "user"
    SET roles = REPLACE(REPLACE(REPLACE(REPLACE(roles, '[\"', ''), '\"]', ''), '\",\"', ','), '"', '')
  `);

  // Make AI Team users also TeamHead
  await manager.query(`
    UPDATE "user"
    SET roles = 'AI Team,TeamHead'
    WHERE roles = 'AI Team'
  `);

  console.log('User roles fixed and AI Team made TeamHead.');
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 