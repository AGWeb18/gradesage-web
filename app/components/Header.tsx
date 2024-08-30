"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-primary-light dark:text-primary-dark"
          >
            GradeSage AI
          </Link>
          <div className="hidden sm:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/faq"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              FAQ
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {session.user?.name?.[0] || "U"}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Sign In
              </Link>
            )}
          </div>
          <button
            className="sm:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="sm:hidden mt-4 space-y-4">
            <ThemeToggle />
            <Link
              href="/faq"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              FAQ
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
