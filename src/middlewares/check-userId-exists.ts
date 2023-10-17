import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUserIdExists(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userId = req.cookies.userId

  if (!userId) {
    res.status(401).send({
      error: 'Unauthorized!',
    })
  }
}
