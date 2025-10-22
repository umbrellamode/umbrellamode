import { motion } from "motion/react";

export const Widget = () => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: "spring",
        visualDuration: 0.3,
        bounce: 0.15,
      }}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "300px",
        zIndex: 50,
        backgroundColor: "#ef4444", // red-500
        borderLeft: "1px solid #e5e7eb", // border-gray-200
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "16px",
        fontWeight: "500",
      }}
    >
      Widget
    </motion.div>
  );
};
