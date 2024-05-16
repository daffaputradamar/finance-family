import { Wallet } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <Wallet className="stroke h-7 w-7 stroke-green-400 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-green-500 to-teal-300 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Finance Family
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-green-500 to-teal-300 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Finance Family
      </p>
    </a>
  );
}

export default Logo;
