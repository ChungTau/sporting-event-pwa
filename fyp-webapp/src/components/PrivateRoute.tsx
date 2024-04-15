// PrivateRoute.js
'use client';
import { ChildrenProps } from '@/types/childrenProps';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './ui/button';

const PrivateRoute = ({ children }:ChildrenProps) => {
  const {data:session} = useSession();

  // Render children if user is authenticated, otherwise render nothing
  return session ? children : <div className='flex flex-col items-center justify-center m-auto gap-2 h-[500px]'>
   <Image src={'/images/unauthorized.png'} width={100} height={100} alt='unauthorized' priority />
    <div className='font-medium text-lg'>Unauthorized 401</div>
    <Button className='w-32' onClick={()=>signIn('keycloak')}>
        Login
    </Button>
  </div>;
};

export default PrivateRoute;
