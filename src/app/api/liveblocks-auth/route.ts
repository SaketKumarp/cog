import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret:
    "sk_dev_HuS-38D3TNQeG7bLl-s6Su6udWcCUz5MK228wgsybekbJXR_nBpHss16j8f7QW4Z",
});
export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("unauhtorized", { status: 403 });
  }

  const { room } = await request.json();
  const board = await convex.query(api.boards.get, { id: room });

  if (board?.orgId !== authorization.orgId) {
    return new Response("unauthorized");
  }

  const userInfo = {
    name: user.fullName,
    pictue: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo: userInfo,
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

  return new Response(body, { status: status });
}
