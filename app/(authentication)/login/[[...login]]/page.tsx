"use client";
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Loader from "../../../../components/ui/loader";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div
        className="h-full lg:flex flex-col items-center 
      justify-center px-4"
      >
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#000000]">Welcome Back!</h1>

          <p className="text-[#7E8BA0]">
            Please login to access the dashboard
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-blue-900  hidden lg:flex items-center justify-center ">
        <Image
          src="/loginPagePicture.png"
          height={200}
          width={400}
          className=""
          alt="Login Page Image"
        />
      </div>
    </div>
  );
}
