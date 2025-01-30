import { useUser } from "@clerk/nextjs";
import '@styles/welcome.css'

export const WelcomeMessage = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="mt-6 px-6 py-4 bg-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800">
        Welcome{" "}
        {isLoaded ? (
          <span className="text-[#009dff] animate-typing">{user?.firstName}</span>
        ) : (
          <span className="text-gray-500 animate-typing">Guest</span>
        )}
        <span className="cursor-blink">|</span>
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        We're glad to have you here. Explore your dashboard and manage your funds seamlessly.
      </p>
    </div>
  );
};
