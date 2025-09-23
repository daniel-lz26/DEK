import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../lib/utils";

const navItems = [
    {name: "Profile", href: "#profile"},
    {name: "Stats", href: "#stats"},
    {name: "Friends", href: "#friends"},
    {name: "shuffle", href: "#shuffle"}
]
// makng a putting the entire navbar into one varible to call it to the home file
export const Navbar = () => {
    <header className="bg-dark-background sticky top-0 z-[20] mx-auto flex w-full items-center justify-between border-b border-gray-500 p-8">
        TEST TEST TEST
        <h1>
            NavBar TEST TEST TEST
        </h1>
    </header>
}