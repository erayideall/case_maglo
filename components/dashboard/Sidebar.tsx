"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import HomeIcon from "@/components/icons/HomeIcon";
import TransactionIcon from "@/components/icons/TransactionIcon";
import InvoicesIcon from "@/components/icons/InvoicesIcon";
import MyWalletIcon from "@/components/icons/MyWalletIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import HelpIcon from "@/components/icons/HelpIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "@/components/modals/ConfirmModal";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Transactions", href: "/dashboard#transactions", icon: TransactionIcon },
  { name: "Invoices", href: "/dashboard#invoices", icon: InvoicesIcon },
  { name: "My Wallets", href: "/dashboard#wallets", icon: MyWalletIcon },
  { name: "Settings", href: "/dashboard#settings", icon: SettingsIcon },
];

const bottomItems = [
  { name: "Help", href: "/dashboard#help", icon: HelpIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-100 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#FAFAFA] h-screen flex flex-col shadow-xl
          transform transition-transform duration-300 ease-in-out overflow-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-2">
            <Image
              src={"/images/logo.svg"}
              width={122}
              height={30}
              alt="logo"
            />
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-6 mt-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-[16px] font-medium min-h-12 mb-2 ${isActive
                      ? "bg-lime-300 text-gray-900 font-medium"
                      : "text-[#929EAE] hover:bg-gray-200"
                    }`}
                >
                  <Icon color={isActive ? "#1B212D" : "#929EAE"} width={20} height={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Menu */}
        <div className="px-6 pb-8 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Icon color="#929EAE" width={20} height={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <LogoutIcon color="#929EAE" width={20} height={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        isLoading={isLoggingOut}
      />
    </>
  );
}
