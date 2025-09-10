import { AppDataSource } from '../src/data-source';

async function main() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  await manager.query(`
    UPDATE "user"
    SET "name" = 'Rahul'
    WHERE email = 'designer1@hagerstone.com'
  `);

  console.log('User name updated for designer1@hagerstone.com.');
  await AppDataSource.destroy();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
