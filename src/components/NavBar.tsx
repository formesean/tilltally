import { ThemeToggle } from "./ThemeToggle";

export default function NavBar() {
  return (
    <section className="fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-5 py-2 bg-white dark:bg-[hsl(222.2,84%,4.9%)] shadow shadow-slate-800">
        <h1>Logo</h1>
        <ThemeToggle />
      </div>
    </section>
  );
}
