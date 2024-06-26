'use client';
import {useState} from 'react';
import LinksDropdown from './LinksDropdown';
import {useSession, signOut} from 'next-auth/react';
import {UserAvatar} from '@/components/UserAvatar';
import ModeToggle from './ThemeToggle';

function Navbar() {
    const session = useSession();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <nav className="bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between">
            <div>
                <LinksDropdown />
            </div>
            <div className="flex items-center gap-x-4">
                <ModeToggle />
                <UserAvatar
                    session={session}
                    setIsProfileMenuOpen={setIsProfileMenuOpen}
                />
                {isProfileMenuOpen && (
                    <div
                        className="absolute right-4 z-10 mt-32 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button">
                        <button
                            onClick={() => {
                                setIsProfileMenuOpen(false);
                                signOut({callbackUrl: '/'});
                            }}
                            className="block px-4 py-2 text-sm text-gray-700"
                            role="menuitem"
                            id="user-menu-item-2">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
export default Navbar;
