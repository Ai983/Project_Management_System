import { AppDataSource } from '../src/data-source';

async function main() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  await manager.query(`
    UPDATE "user"
    SET "teamId" = '11111111-1111-1111-1111-111111111111'
    WHERE email = 'director1@hagerstone.com';
  `);

  await manager.query(`
    UPDATE "user"
    SET "teamId" = '22222222-2222-2222-2222-222222222222'
    WHERE email = 'director2@hagerstone.com';
  `);

  console.log('Director teamIds updated successfully.');
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 