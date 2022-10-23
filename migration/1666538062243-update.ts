import { MigrationInterface, QueryRunner } from 'typeorm';

export class update1666538062243 implements MigrationInterface {
  name = 'update1666538062243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`shop_item\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` ADD \`name\` varchar(44) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` ADD \`description\` varchar(9999) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` ADD \`description\` varchar(10000) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(`ALTER TABLE \`shop_item\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`shop_item\` ADD \`name\` varchar(60) NOT NULL`,
    );
  }
}
