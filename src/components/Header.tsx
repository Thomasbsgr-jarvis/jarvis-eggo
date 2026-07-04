"use client";

import Image from "next/image";
import { version, full_name, public_routes } from "@/lib/config/app";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

export default function Header() {
  const pathname = usePathname();
  const isPublicRoute = (public_routes as readonly string[]).includes(pathname);

  return (
    <div className="px-12 py-7 absolute top-0 z-10 select-none flex items-center justify-between w-full">
      <div className="group flex gap-4 items-center hover:cursor-none">
        {/* Logo */}
        <Image
          loading="eager"
          src="/icon.svg"
          alt="Logo"
          width={36}
          height={36}
        />

        {/* Name */}
        <p className="font-semibold overflow-hidden border-b-2 sm:group-hover:border-b-border border-b-transparent transition-all duration-1000 ease-in-out">
          {/* Letter */}
          {full_name.map((word: string, index: number) => (
            <span key={index} className="inline-flex items-baseline">
              {word.charAt(0)}
              <span className="text-foreground-muted overflow-hidden inline-block max-w-0 sm:group-hover:max-w-100 transition-all duration-[1.5s] ease-in-out whitespace-nowrap">
                {word.slice(1)}
              </span>
              <span className="sm:group-hover:opacity-0 transition-all duration-200 ease-in-out">
                .
              </span>
            </span>
          ))}

          {/* Version */}
          <span className="ml-1.5 text-gray-500">{version}</span>
        </p>
      </div>

      {/* LogOut */}
      {!isPublicRoute && (
        <button
          type="button"
          className={`flex items-center justify-center cursor-pointer`}
          onClick={() => logout()}
        >
          <LogOut size={20} className="text-foreground-muted" />
        </button>
      )}
    </div>
  );
}
