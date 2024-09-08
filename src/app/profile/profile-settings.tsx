"use client";

import {
    EnvelopeIcon, LockClosedIcon, ChevronRightIcon,
    ChevronLeftIcon, UserIcon, IdentificationIcon,
    Square3Stack3DIcon
} from "@heroicons/react/24/solid";
import { useState } from "react";
import UpdatePasswordForm from "./update-password-form";
import ChangeBioForm from "./change-bio-form";
import { setEmailVisibilityServer } from "@/backend-lib/actions";
import { useSearchParams } from 'next/navigation'

enum ProfileSettingsTabs {
    ChangePassword,
    ChangeEmailVisibility,
    AddChangeBio,
    ChangeMembership
}

export default function ProfileSettings({ username, email, bio, emailVisbility }:
    { username: string, email: string, bio: string | null, emailVisbility: boolean }) {

    const searchParams = useSearchParams();
    let initialProfileTab = null;
    if (searchParams.get("profileTab") === "ChangeMembership") {
        initialProfileTab = ProfileSettingsTabs.ChangeMembership;
    }

    const [profileSettingsTab, setProfileSettingsTab] = useState<ProfileSettingsTabs | null>(initialProfileTab);
    const [emailVisible, setEmailVisible] = useState(emailVisbility);
    const [updatingEmailVisibility, setUpdatingEmailVisibility] = useState(false);
    const [emailVisibilityErrors, setEmailVisibilityErrors] = useState<string | null>(null);

    const updateEmailVisibility = async (newEmailVisibility: boolean) => {
        setUpdatingEmailVisibility(true);
        const { isEmailVisibilityChanged, errorMessage } = await setEmailVisibilityServer(newEmailVisibility);
        if (isEmailVisibilityChanged) {
            setEmailVisibilityErrors(null);
            setEmailVisible(newEmailVisibility);
        } else {
            setEmailVisibilityErrors(errorMessage);
        }
        setUpdatingEmailVisibility(false);
    }

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
                    <div className="px-4 py-2">
                        <div className="flex flex-row items-center gap-2">
                            <Square3Stack3DIcon className="h-4" />
                            <div>Membership</div>
                        </div>
                        <button className="flex flex-row items-center justify-between text-sm text-gray-500 hover:text-black hover:bg-white rounded-lg p-1"
                            onClick={() => {
                                setProfileSettingsTab(ProfileSettingsTabs.ChangeMembership);
                            }}>
                            <div>Change membership</div>
                            <ChevronRightIcon className="h-4" />
                        </button>
                    </div>
                </div>
                {
                    profileSettingsTab === ProfileSettingsTabs.ChangePassword ?
                        <div className="grow flex flex-row align-top bg-green-100 rounded-lg px-2 lg:px-5 py-4 gap-2">
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
                        <div className="grow flex flex-row align-top bg-blue-100 rounded-lg pl-2 lg:pl-5 pr-10 py-4 gap-2">
                            <ChevronLeftIcon className={`h-6 text-gray-400 hover:text-black lg:hidden`}
                                onClick={() => setProfileSettingsTab(null)} />
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-row items-center gap-2">
                                    <IdentificationIcon className="h-4" />
                                    <div>Add/change your bio</div>
                                </div>
                                {(!bio || bio.length === 0) &&
                                    <div className="text-xs text-gray-500">
                                        Looks like you have no bio yet! Add one to spice up your user page.
                                    </div>
                                }
                                <ChangeBioForm oldBio={bio} />
                            </div>
                        </div>
                        : ""
                }
                {
                    profileSettingsTab === ProfileSettingsTabs.ChangeEmailVisibility ?
                        <div className="grow flex flex-row align-top bg-purple-100 rounded-lg px-2 lg:px-5 py-4 gap-2">
                            <ChevronLeftIcon className={`h-6 text-gray-400 hover:text-black lg:hidden`}
                                onClick={() => setProfileSettingsTab(null)} />
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-row items-center gap-2">
                                    <EnvelopeIcon className="h-4" />
                                    <div>Change your email visibility</div>
                                </div>
                                <div className="text-black flex flex-row gap-1 items-center">
                                    Your email is currently
                                    <div className={`text-xl ${emailVisible ? "text-green-600" : "text-red-600"}`}>
                                        {emailVisible ? "visible" : "invisible"}
                                    </div>
                                    on your user page.
                                </div>
                                <div className="text-xs text-gray-500">{emailVisible ?
                                    "Toggle visibility to hide it from the world!" :
                                    "Toggle visibility to allow other users to see your email!"
                                }
                                </div>
                                <button className="mt-2 flex flex-row bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold 
                                hover:bg-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:font-normal 
                                aria-disabled:hover:bg-blue-400 w-fit"
                                    onClick={() => {
                                        updateEmailVisibility(!emailVisible);
                                    }
                                    }
                                    aria-disabled={updatingEmailVisibility}
                                    disabled={updatingEmailVisibility}
                                >
                                    {emailVisible ? "Make email INVISIBLE" : "Make email VISIBLE"}
                                </button>
                                {
                                    !!emailVisibilityErrors && (
                                        <div className="text-xs text-red-600">{emailVisibilityErrors}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        : ""
                }
                {
                    profileSettingsTab === ProfileSettingsTabs.ChangeMembership ?
                        <div className="grow flex flex-row align-top bg-teal-300 rounded-lg px-2 lg:px-5 py-4 gap-2">
                            <ChevronLeftIcon className={`h-6 text-gray-400 hover:text-black lg:hidden`}
                                onClick={() => setProfileSettingsTab(null)} />
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row items-center gap-2">
                                    <Square3Stack3DIcon className="h-4" />
                                    <div>Change your membership</div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Coming soon!
                                </div>
                            </div>
                        </div>
                        : ""
                }
            </div>
        </main >
    );
}