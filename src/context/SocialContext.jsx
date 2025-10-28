import { createContext } from "react";

const SocialContext = createContext();

export const SocialProvider = ({ children }) => {
  const messages = [
    { from: "Alice", text: "Hey, how are you?" },
    { from: "Bob", text: "I'm good, thanks! How about you?" },
    { from: "Alice", text: "Doing well, just working on a project." },
  ];

  

  return (
    <SocialContext.Provider value={{ messages }}>
      {children}
    </SocialContext.Provider>
  );
};
