import { SendIcon } from "lucide-react";
import { useState } from "react";

interface FloatingInputProps {
  onSubmit: (value: string) => void;
}

export const FloatingInput = ({ onSubmit }: FloatingInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
    setValue(""); // Clear input after submission
  };

  return (
    <div
      style={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "8px 16px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          minWidth: "300px",
          maxWidth: "500px",
        }}
      >
        <input
          type="text"
          placeholder="Do you need help with anything?"
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "14px",
            padding: "4px 0",
            background: "transparent",
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <SendIcon size={16} />
        </button>
      </form>
    </div>
  );
};
