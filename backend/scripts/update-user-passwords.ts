import { AppDataSource } from '../src/data-source';

async function main() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  // Update password and name for specific users
  await manager.query(`
    UPDATE "user"
    SET password = '$2b$10$YUfsOQeEXOaOO4WO9GgrYedR/HkDNO1x01utuGEbS0L8FdAWNsEg2',
        name = 'Example Name'
    WHERE email IN ('designer1@hagerstone.com', 'director1@hagerstone.com');
  `);

  // Set a name for all users if missing
  await manager.query(`
    UPDATE "user"
    SET name = 'ABC'
    WHERE name IS NULL OR name = '';
  `);

  console.log('User passwords and names updated successfully.');
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 