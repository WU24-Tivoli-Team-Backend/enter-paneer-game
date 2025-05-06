import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <nav>
        <Link href="/groups">Groups</Link>
        <Link href="/profile">Profile</Link>
      </nav>

      <h1>Amusement Park</h1>
    </main>
  );
}
