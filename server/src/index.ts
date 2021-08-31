
import { MikroORM } from "@mikro-orm/core";
import {Post} from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const post = orm.em.create(Post, {name: 'my first post'});
  await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});

  console.log('POSTLAR', posts);
}

main();