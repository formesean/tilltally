import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ShoppingBasket } from "lucide-react";

export default function NavBar() {
  return (
    <section className="fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-5 py-2 bg-white dark:bg-[hsl(222.2,84%,4.9%)] shadow shadow-slate-800">
        <div className="flex gap-5 items-center">
          <div className="flex gap-3 items-center">
            <ShoppingBasket />
            <Link href={"/"}>TillTally</Link>
          </div>

          <div className="flex gap-3 text-sm items-center">
            <Link href={"/transactions"}>Transactions</Link>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </section>
  );
}
