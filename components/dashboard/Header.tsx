"use client";

import { useState, useRef, useEffect } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import Image from "next/image";
import ArrowDown from "../icons/ArrowDownIcon";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function Header() {
    const { user, logout } = useAuth();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleLogoutClick = () => {
        setUserMenuOpen(false);
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

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = [
        { id: 1, title: "New Payment Received", message: "Payment of ₺2,500", time: "5 minutes ago" },
        { id: 2, title: "Invoice Created", message: "Invoice INV-2024-001", time: "1 hour ago" },
        { id: 3, title: "New Customer", message: "Ahmet Yılmaz registered", time: "2 hours ago" },
    ];

    return (
        <header className="bg-white border-b border-gray-200 fixed lg:static top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                {/* Dashboard Title */}
                <div className="ml-12 lg:ml-0">
                    <h1 className="text-lg sm:text-[25px] font-semibold text-[#1B212D]">Dashboard</h1>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Search Icon - Hidden on mobile */}
                    <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <SearchIcon width={24} height={24} color="#64748b" />
                    </button>

                    {/* Notification Dropdown */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <NotificationIcon width={24} height={24} color="#64748b" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Notification Dropdown Menu */}
                        <div
                            className={`absolute right-0 z-10 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 origin-top-right ${notificationOpen
                                ? "opacity-100 scale-100 visible"
                                : "opacity-0 scale-95 invisible"
                                }`}
                        >
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                                    >
                                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    See All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User Menu Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 sm:gap-3 bg-[#FAFAFA] hover:bg-gray-50 rounded-[100px] px-2 sm:px-3 py-2 transition-colors"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-gray-800">{user?.fullName || 'User'}</span>
                            <div className={`hidden sm:block transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}>
                                <ArrowDown />
                            </div>
                        </button>

                        {/* User Dropdown Menu */}
                        <div
                            className={`absolute right-0 z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 origin-top-right ${userMenuOpen
                                ? "opacity-100 scale-100 visible"
                                : "opacity-0 scale-95 invisible"
                                }`}
                        >
                            <div className="px-4 py-3 border-b border-gray-200">
                                <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                                <p className="text-xs text-gray-400 mt-1">Role: {user?.role || 'N/A'}</p>
                            </div>
                            <div className="py-2">
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Profile
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Settings
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Help
                                </button>
                            </div>
                            <div className="border-t border-gray-200 py-2">
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
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
        </header>
    );
}
