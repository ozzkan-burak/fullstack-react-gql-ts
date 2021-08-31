
import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from "./resolvers/post";

const main = async () => {

  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const post = orm.em.create(Post, {name: 'my first post'});
  await orm.em.persistAndFlush(post);

  const app = express();
  const PORT = 4000;

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false
    }),
    context: ()=> ({em: orm.em})
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app })

  app.get('/', (_req, res) => {
    res.send('ANSAYFA')
  });

  app.listen(PORT, () => {
    console.log(`Server run on ${PORT} `)
  })
}

main().catch((err) => {
  console.error(err);
});