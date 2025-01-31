import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/bgimg.jpg')" }} // Replace this with your actual image
    >
      <div className="flex p-3 mt-10 bg-slate-300 rounded-2xl sm:mx-auto sm:w-full sm:max-w-sm shadow-xl">
        <Link
          href="/signin"
          className=" w-auto bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-md transition duration-300 mx-auto"
        >
          Signin
        </Link>
        <Link
          href="/signup"
          className="w-auto bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-md transition duration-300 mx-auto"
        >
          Signup
        </Link>
      </div>
      
    </div>
  );
}
