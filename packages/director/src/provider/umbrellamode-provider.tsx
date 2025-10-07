import { createContext, useContext } from "react";

interface UmbrellaModeContextInterface {
  apiKey: string;
}

const UmbrellaModeContext = createContext<
  UmbrellaModeContextInterface | undefined
>(undefined);

export const UmbrellaModeProvider = ({
  children,
  apiKey,
}: {
  children: React.ReactNode;
  apiKey: string;
}) => {
  return (
    <UmbrellaModeContext.Provider value={{ apiKey }}>
      {children}
    </UmbrellaModeContext.Provider>
  );
};

export const useUmbrellaMode = () => {
  const context = useContext(UmbrellaModeContext);
  if (!context) {
    throw new Error(
      "useUmbrellaMode must be used within a UmbrellaModeProvider"
    );
  }
  return context;
};
