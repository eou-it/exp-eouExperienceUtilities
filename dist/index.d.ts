import { FC } from 'react';

export interface UserLookupProps {
  userGuid?: string;
  setUserId?: (id: string, userId?: string) => void;
  setUserFirstName?: (id: string, name?: string) => void;
  setUserLastName?: (id: string, name?: string) => void;
}

export const UserLookup: FC<UserLookupProps>;