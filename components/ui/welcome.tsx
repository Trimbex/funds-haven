import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!text) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

export const WelcomeMessage = () => {
  const { user, isLoaded } = useUser();
  const welcomeText = ` Welcome, ${user?.firstName || 'Guest'}`;
  const { displayText, isComplete } = useTypewriter(isLoaded ? welcomeText : '');

  // Split the text to apply different styles to firstName
  const parts = displayText.split(user?.firstName || 'Guest');
  const beforeName = parts[0];
  const name = user?.firstName || 'Guest';
  const showName = displayText.length > beforeName.length;

  return (
    <div className="flex justify-left items-center min-h-[20vh] pt-36 pl-96">
      <div className="font-mono text-6xl font-bold text-center">
        {beforeName}
        {showName && <span className="text-sky-400">{name}</span>}
        {!isComplete && <span className="animate-pulse">|</span>}
      </div>
    </div>
  );
};

export default WelcomeMessage;