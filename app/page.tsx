import Image from 'next/image';
import Logo from '../assets/logo.svg';
import LandingImg from '../assets/main.svg';
import SignInButton from '@/components/SignInButton';

export default function Home() {
    return (
        <main>
            <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6 ">
                <Image src={Logo} alt="logo" />
            </header>
            <section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
                <div>
                    <h1 className="capitalize text-4xl md:text-7xl font-bold">
                        job <span className="text-primary">tracking</span> app
                    </h1>
                    <p className="leading-loose max-w-md mt-4 ">
                        Welcome to Jobify, where job hunting meets simplicity
                        and success. Say goodbye to scattered spreadsheets and
                        endless tabs. With our intuitive job tracking app, you
                        will stay organized, motivated, and ahead of the game.
                        Start your journey to career greatness today!
                    </p>
                    <SignInButton />
                </div>
                <Image
                    src={LandingImg}
                    alt="landing"
                    className="hidden lg:block "
                />
            </section>
        </main>
    );
}
