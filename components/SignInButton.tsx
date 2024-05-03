'use client';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {signIn, getProviders} from 'next-auth/react';
import Link from 'next/link';

const SignInButton = () => {
    const [providers, setProviders] = useState<any | null>(false);

    useEffect(() => {
        const setAuthProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        setAuthProviders();
    }, []);

    return (
        <>
            {providers &&
                Object.values(providers).map((provider: any, index) => (
                    <Button
                        key={index}
                        className="mt-4"
                        onClick={() => {
                            signIn(provider?.id, {callbackUrl: '/add-job'});
                        }}>
                        Get Started
                    </Button>
                ))}
        </>
    );
};

export default SignInButton;
