"use client";

import { Button } from "@umbrellamode/ui/components/button";
import { hello } from "@umbrellamode/director";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm" onClick={() => hello({ name: "World" })}>
          Button
        </Button>
      </div>
    </div>
  );
}
