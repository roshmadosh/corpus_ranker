import { Dispatch, SetStateAction } from 'react';

export type StateSetter<A> = Dispatch<SetStateAction<A>>