import Fastify from "fastify";
import { prisma, PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import {z} from "zod";
import ShortUniqueID from "short-unique-id";

const primsa = new PrismaClient({
  log: ["query"],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(cors, {
    origin: true,
  });
  fastify.get("/pools/count", async () => {
    const count = await primsa.pool.count(); 
    return { count };
  });

  fastify.get("/users/count", async () => {
    const count = await primsa.user.count(); 
    return { count };
  });

  fastify.get("/guesses/count", async () => {
    const count = await primsa.guess.count(); 
    return { count };
  });

  fastify.post("/pools", async (request,reply) => {
    const createPoolBody = z.object({
      title:z.string(),
    })
    const {title}=createPoolBody.parse(request.body)
    const generate = new ShortUniqueID({length:6})
    const code = String(generate()).toUpperCase()

    await primsa.pool.create({
      data:{
        title,
        code,
      }
    })
    return reply.status(201).send({code})
  });
  await fastify.listen({ port: 3333, /*host: "0.0.0.0 "*/ });
}
bootstrap();
