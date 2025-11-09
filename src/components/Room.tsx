"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
interface RoomPorps {
  children: React.ReactNode;
  roomId: string;
  fallback: React.ReactNode;
}
export const Room = ({ children, roomId, fallback }: RoomPorps) => {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_TuJlKxXbBdHf29Q3F06LjQvF5o-BwI82AU-dox2_3K7E6jrgm9aGE24eBDE1cCWz"
      }
    >
      <RoomProvider id={roomId} initialPresence={{}}>
        <ClientSideSuspense fallback={fallback}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
