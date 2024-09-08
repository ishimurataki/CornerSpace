"use server";

import Link from "next/link";

export default async function AboutPage() {

    return (
        <main className="absolute flex flex-col my-5 md:my-10 mx-10 md:mx-40 gap-2 pb-20">
            <h1 className="text-3xl">About CornerSpace</h1>
            <hr className="bg-gray-500" />
            <p>Hi all! My name is Taki Ishimura and I&apos;m the sole developer of CornerSpace, this online voxel-art platform that I hope you are enjoying.
                My goal with this project is to make voxel art accessible to everyone and anyone, where users can start creating beautiful pieces of 3D cube art with little to no prior knowledge.
                The user interface should be intuitive and simple while supporting a broad range of actions and full expressability in your work.
                On top of that, users should be able to connect with one another, sharing and liking pieces of 3D art that they are proud of.
            </p>

            <p>
                Some new feautures that are currently in the developement pipeline:
            </p>
            <ul className="list-disc mx-10">
                <li>Multiple point-lights support for realistic rendering</li>
                <li>Multi-user collaboration in a single canvas</li>
                <li>Canvas export to standard 3D model formats.</li>
            </ul>
            <p>
                If you would like to leave some feedback for this platform, whether is its a bug-report, a feature request, or any question you may have, please see <Link href="/feedback"
                    className="text-blue-600 hover:text-cyan-600">here</Link>!
            </p>

            <p>
                If you would like to learn more about me and my other projects, checkout my personal website <Link href="https://ishimurataki.github.io/about.html"
                    className="text-blue-600 hover:text-cyan-600" rel="noopener noreferrer" target="_blank">here</Link>!
            </p>
        </main>
    );
}