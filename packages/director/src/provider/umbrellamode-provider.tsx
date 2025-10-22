import { createContext, useState } from "react";

interface UmbrellaModeContextInterface {
  apiKey: string;
  baseUrl?: string;
}

export const UmbrellaModeContext = createContext<
  UmbrellaModeContextInterface | undefined
>(undefined);

export const UmbrellaModeProvider = ({
  children,
  apiKey,
  baseUrl = "https://api.umbrellamode.com",
}: {
  children: React.ReactNode;
  apiKey: string;
  baseUrl?: string;
}) => {
  const [personId, setPersonId] = useState<string | undefined>(undefined);

  async function identify(args: IdentifyArgs) {
    const url = `${context?.baseUrl}/person/identify`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(args),
      headers: new Headers({
        "Content-Type": "application/json",
        ...(context?.apiKey ? { Authorization: context.apiKey } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to identify person: ${response.statusText}`);
    }
  }

  return (
    <UmbrellaModeContext.Provider value={{ apiKey, baseUrl }}>
      {children}
    </UmbrellaModeContext.Provider>
  );
};
