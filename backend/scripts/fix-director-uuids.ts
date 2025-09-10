import { AppDataSource } from '../src/data-source';

async function main() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  await manager.query(`
    UPDATE "user"
    SET id = 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1'
    WHERE email = 'director1@hagerstone.com';
  `);

  await manager.query(`
    UPDATE "user"
    SET id = 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2'
    WHERE email = 'director2@hagerstone.com';
  `);

  console.log('Director UUIDs updated successfully.');
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 