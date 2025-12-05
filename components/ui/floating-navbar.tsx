"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { JSX } from "react";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    return (
        <motion.div
            initial={{
                opacity: 1,
                y: -100,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            transition={{
                duration: 0.2,
            }}
            className={cn(
                "flex max-w-fit fixed top-10 inset-x-0 mx-auto glass rounded-full z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
                className
            )}
        >
            {navItems.map((navItem: any, idx: number) => (
                <a
                    key={`link=${idx}`}
                    href={navItem.link}
                    className={cn(
                        "relative items-center flex space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200"
                    )}
                >
                    <span className="block sm:hidden">{navItem.icon}</span>
                    <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
                </a>
            ))}
            <button className="border text-sm font-medium relative border-border text-foreground hover:bg-secondary/50 px-6 py-2 rounded-full transition-all duration-300">
                <span>Login</span>
                <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-primary/50 to-transparent h-px" />
            </button>
        </motion.div>
    );
};
