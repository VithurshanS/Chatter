import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={'/signin'}>Signin</Link>
      <Link href={'/signup'}>Signup</Link>
    </div>
  );
}
