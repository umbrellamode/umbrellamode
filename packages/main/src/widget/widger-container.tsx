import { motion } from "motion/react";

const widgetWidth = 400;
export const widgetBackground = "oklch(0.97 0 0)";
export const widgetPadding = 16;

export const WidgetContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ x: widgetWidth }}
      animate={{ x: 0 }}
      exit={{ x: widgetWidth }}
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
        width: widgetWidth,
        zIndex: 50,
        borderLeft: "1px solid #e5e7eb", // border-gray-200
        // boxShadow:
        //   "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: "500",
        background: "oklch(0.97 0 0)",
      }}
    >
      {children}
    </motion.div>
  );
};
