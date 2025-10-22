import { useUmbrellaMode } from "../provider/use-umbrellamode";

export const WidgetMessages = () => {
  const { userActions } = useUmbrellaMode();
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        width: "100%",
        minHeight: 0,
      }}
    >
      <div style={{ padding: 16 }}>
        <pre>
          {JSON.stringify(
            userActions.map((action) => {
              if ("element" in action) {
                return action.element.className;
              }
              return action.type;
            }),
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
