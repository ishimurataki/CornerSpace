"use client";

import {
    EnvelopeIcon, LockClosedIcon, ChevronRightIcon,
    ChevronLeftIcon, UserIcon, IdentificationIcon
} from "@heroicons/react/24/solid";
import { useState } from "react";
import UpdatePasswordForm from "./update-password-form";

enum ProfileSettingsTabs {
    ChangePassword,
    ChangeEmailVisibility,
    AddChangeBio
}

export default function ProfileSettings({ username, email }: { username: string, email: string }) {

    const [profileSettingsTab, setProfileSettingsTab] = useState<ProfileSettingsTabs | null>(null);

    return (
        <main className="absolute flex flex-col p-4 md:p-8 lg:p-10 w-full md:w-3/4 lg:w-2/3">
            <p className="text-2xl">Your Profile Settings</p>
            <div className="flex flex-row gap-1 mt-4 w-full">
                <div className={`flex flex-col bg-cyan-100 rounded-lg divide-y-2 divide-white text-nowrap overflow-clip
                ${profileSettingsTab !== null ? "w-3 lg:w-fit" : "w-full lg:w-fit"}`}>
                    <div className="px-4 py-2">
                        <div className="flex flex-row items-center gap-2">
                            <UserIcon className="h-4" />
                            <div>Username</div>
                        </div>
                        <div className="text-sm text-gray-500">{username}</div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex flex-row items-center gap-2">
                            <EnvelopeIcon className="h-4" />
                            <div>Email</div>
                        </div>
                        <div className="text-sm text-gray-500">{email}</div>
                        <button className="flex flex-row items-center justify-between text-sm text-gray-500 hover:text-black hover:bg-white rounded-lg p-1 mt-1"
                            onClick={() => {
                                setProfileSettingsTab(ProfileSettingsTabs.ChangeEmailVisibility);
                            }}>
                            <div>Change email visibility</div>
                            <ChevronRightIcon className="h-4" />
                        </button>
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex flex-row items-center gap-2">
                            <IdentificationIcon className="h-4" />
                            <div>Bio</div>
                        </div>
                        <button className="flex flex-row items-center justify-between text-sm text-gray-500 hover:text-black hover:bg-white rounded-lg p-1"
                            onClick={() => {
                                setProfileSettingsTab(ProfileSettingsTabs.AddChangeBio);
                            }}>
                            <div>Add/Change Bio</div>
                            <ChevronRightIcon className="h-4" />
                        </button>

                    </div>
                    <div className="px-4 py-2">
                        <div className="flex flex-row items-center gap-2">
                            <LockClosedIcon className="h-4" />
                            <div>Password</div>
                        </div>
                        <button className="flex flex-row items-center justify-between text-sm text-gray-500 hover:text-black hover:bg-white rounded-lg p-1"
                            onClick={() => {
                                setProfileSettingsTab(ProfileSettingsTabs.ChangePassword);
                            }}>
                            <div>Change password</div>
                            <ChevronRightIcon className="h-4" />
                        </button>
                    </div>
                </div>
                {
                    profileSettingsTab === ProfileSettingsTabs.ChangePassword ?
                        <div className="grow flex flex-row align-top bg-green-100 rounded-lg px-2 lg:px-5 py-2 gap-2">
                            <ChevronLeftIcon className={`h-6 text-gray-400 hover:text-black lg:hidden`}
                                onClick={() => setProfileSettingsTab(null)} />
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row items-center gap-2">
                                    <LockClosedIcon className="h-4" />
                                    <div>Change your password</div>
                                </div>
                                <UpdatePasswordForm />
                            </div>
                        </div>
                        : ""
                }
                {
                    profileSettingsTab === ProfileSettingsTabs.AddChangeBio ?
                        <div className="grow flex flex-row align-top bg-blue-100 rounded-lg px-2 lg:px-5 py-2 gap-2">
                            <ChevronLeftIcon className={`h-6 text-gray-400 hover:text-black lg:hidden`}
                                onClick={() => setProfileSettingsTab(null)} />
                            <div className="flex flex-col divide-y-2 divide-white">
                                <div className="flex flex-row items-center gap-2">
                                    <IdentificationIcon className="h-4" />
                                    <div>Add/change your bio</div>
                                </div>
                            </div>
                        </div>
                        : ""
                }
                {
                    profileSettingsTab === ProfileSettingsTabs.ChangeEmailVisibility ?
                        <div className="grow flex flex-row align-top bg-purple-100 rounded-lg px-2 lg:px-5 py-2 gap-2">
                            <ChevronLeftIcon className={`h-6 text-gray-400 hover:text-black lg:hidden`}
                                onClick={() => setProfileSettingsTab(null)} />
                            <div className="flex flex-col divide-y-2 divide-white">
                                <div className="flex flex-row items-center gap-2">
                                    <EnvelopeIcon className="h-4" />
                                    <div>Change your email visibility</div>
                                </div>
                            </div>
                        </div>
                        : ""
                }
            </div>
        </main >
    );
}