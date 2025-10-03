"use client";

import { Button } from "@umbrellamode/ui/components/button";
import { Director } from "umbrellamode";

export default function Page() {
  const director = new Director();

  const clickHandler = async () => {
    await director.act("#red-button");
  };

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-center">Hello World</h1>
        <Button
          size="sm"
          className="bg-red-500 text-white"
          onClick={() => alert("Hello World")}
          id="red-button"
        >
          Button
        </Button>

        <Button onClick={clickHandler}>Click the red button</Button>
      </div>
    </div>
  );
}
