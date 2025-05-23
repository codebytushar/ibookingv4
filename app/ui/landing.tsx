import { SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

export default function Landing() {
    return (
        <>
            <main>
                <div className="flex h-20 shrink-0 items-end  bg-zinc-100 p-4 md:h-14">
                    <div className="w-full h-full px-4 flex justify-between items-center space-x-4">
                        <Link href="/" legacyBehavior>
                            <a className="flex items-center space-x-1">
                                <SparklesIcon className="shrink-0 w-8 h-8 text-rose-500" />
                                <span className="text-xl font-semibold tracking-wide">
                                    i<span className="text-rose-600">Hundred</span>
                                </span>
                            </a>
                        </Link>
                    </div>
                  
                    <div className="w-full h-full px-4 flex justify-end items-center space-x-4">
                        <Link href="/login" className="ml-4 px-4 py-1 rounded-md bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50 text-white transition" >
                                    Log in
                        </Link>
                    </div>
                    {/* <AcmeLogo /> */}
                </div>
                <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover bg"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
                        }}
                    >
                        <span
                            id="blackOverlay"
                            className="w-full h-full absolute opacity-75 bg-black"
                        ></span>
                    </div>
                    <div className="container relative mx-auto">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                                <div className="pr-12 space-y-3" >
                                    <h1 className="text-white font-semibold text-2xl">
                                        Sarvajanik College of Engineering & Technology, Surat.
                                    </h1>
                                    <p className="text-white font-semibold text-1xl">

                                    </p>
                                    <span className="text-s  font-semibold inline-block py-1 px-2 rounded text-maroon-600 bg-orange-200 last:mr-0 mr-1">
                                        <a href="https://ihundred-doc.triple5.in/" rel="noreferrer" target="_blank">User Guide</a>
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
                        style={{ transform: "translateZ(0)" }}
                    >
                        <svg
                            className="absolute bottom-0 overflow-hidden"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="text-blueGray-200 fill-current"
                                points="2560 0 2560 100 0 100"
                            ></polygon>
                        </svg>
                    </div>
                </div>

                <section className="pb-20 bg-blueGray-200 -mt-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap">
                            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                                            <i className="fas fa-award"></i>
                                        </div>
                                        <h6 className="text-xl font-semibold">Inclusive</h6>
                                        <p className="mt-2 mb-4 text-blueGray-500">

                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                                            <i className="fas fa-retweet"></i>
                                        </div>
                                        <h6 className="text-xl font-semibold">Innovative</h6>
                                        <p className="mt-2 mb-4 text-blueGray-500">

                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                                            <i className="fas fa-fingerprint"></i>
                                        </div>
                                        <h6 className="text-xl font-semibold">Integrated</h6>
                                        <p className="mt-2 mb-4 text-blueGray-500">

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/* <Footer /> */}
        </>
    );
}