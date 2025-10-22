export const PoweredBy = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#666",
          fontFamily: "Inter, sans-serif",
          fontVariantLigatures: "none",
        }}
      >
        Powered by Umbrella Mode
      </span>
      <img
        src="https://sosmw3a5h0wvrg8m.public.blob.vercel-storage.com/logo.png"
        alt="Umbrella Mode logo"
        style={{ height: 20 }}
      />
    </div>
  );
};
