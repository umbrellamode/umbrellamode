"use client";

import { Button } from "@umbrellamode/ui/components/button";
import { Input } from "@umbrellamode/ui/components/input";
import { useState } from "react";
import { useUmbrellaMode } from "../../../packages/main/src/provider/use-umbrellamode";

export default function Page() {
  const { open, isOpen, close } = useUmbrellaMode();

  const [instruction, setInstruction] = useState(
    "Please update my first and last name to David Matthews"
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      alert("Please fill in both first and last name");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission with director
      alert(`Name updated successfully to ${firstName} ${lastName}`);

      // Reset form
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteInstruction = async () => {
    setIsExecuting(true);
    setIsExecuting(false);
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-svh space-y-10">
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Update User Details</h1>

        <Input
          name="firstName"
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          data-ai-intent="username.form.first-name.input"
        />

        <Input
          name="lastName"
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          data-ai-intent="username.form.last-name.input"
        />
      </div>
      <div className="flex flex-col gap-2 w-full max-w-md">
        <label htmlFor="instruction" className="text-sm font-medium">
          Instruction
        </label>
        <textarea
          id="instruction"
          placeholder="Enter your instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={handleExecuteInstruction}
      >
        {isExecuting ? "Executing..." : "Execute Instruction"}
      </Button>

      {isOpen ? (
        <Button onClick={close}>Close Umbrella Mode</Button>
      ) : (
        <Button onClick={() => open()}>Open Umbrella Mode</Button>
      )}
    </div>
  );
}
