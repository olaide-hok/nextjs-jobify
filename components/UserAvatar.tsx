import Image from 'next/image';

export function UserAvatar({
    session,
    setIsProfileMenuOpen,
}: {
    session: any;
    setIsProfileMenuOpen: Function;
}) {
    return (
        <div>
            <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => setIsProfileMenuOpen((prev: boolean) => !prev)}>
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Open user menu</span>
                <Image
                    className="h-8 w-8 rounded-full"
                    src={
                        session?.data?.user?.image ??
                        'https://source.boringavatars.com/marble/120'
                    }
                    alt="User Avatar"
                    width={40}
                    height={40}
                />
            </button>
        </div>
    );
}
