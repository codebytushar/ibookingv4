import { SparklesIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Landing() {
    return (
        <>
            <main className="min-h-screen text-gray-800">
                {/* Hero Section */}
                <section className="text-center px-4 py-24 max-w-4xl mx-auto bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md rounded-xl shadow-lg mt-8">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
                        Welcome to Golokdham IBooking
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-white/90">
                        Effortless room booking and satsangi management for every shivir.
                    </p>
                    <Link href="/dashboard/admin" className="inline-flex items-center">
                        <Button size="lg" className="gap-2 bg-white text-indigo-600 hover:bg-indigo-100">
                            Get Started <ArrowRight size={18} />
                        </Button>
                    </Link>
                </section>

                {/* Add vertical space between sections */}
                <div className="h-16" />

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-24 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Room Allocation",
                            desc: "Manage room properties, types and occupancy with ease.",
                        },
                        {
                            title: "Satsangi Management",
                            desc: "Track seva, preferences, and check-in/out status.",
                        },
                        {
                            title: "Shivir Planning",
                            desc: "Organize events with full visibility and control.",
                        },
                    ].map((feat) => (
                        <Card
                            key={feat.title}
                            className="rounded-2xl shadow-lg bg-gradient-to-br from-white to-indigo-100/80 border-none"
                        >
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-800">{feat.title}</h3>
                                <p className="text-gray-600">{feat.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Add vertical space before footer */}
                <div className="h-16" />

                {/* Footer */}
                <footer className="text-center text-sm text-white py-8 bg-indigo-600/90 backdrop-blur-md">
                    © {new Date().getFullYear()} Golokdham IBooking. All rights reserved.
                </footer>
            </main>
            {/* <Footer /> */}
        </>
    );
}