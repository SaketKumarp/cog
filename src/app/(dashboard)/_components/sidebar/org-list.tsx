"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { ItemList } from "./is-active";
 

export const OrgList = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;

  return (
    <div>
      <ul className="space-y-4">
        {userMemberships.data.map((mem) => (
          <ItemList
            key={mem.organization.id}
            id={mem.organization.id}
            name={mem.organization.name}
            imageUrl={mem.organization.imageUrl}
          />
        ))}
      </ul>
    </div>
  );
};
