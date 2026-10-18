
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type NotificationSeverity = "success" | "error" | "info" | "warning";

type NotificationContextValue = {
  notify: (message: string, severity?: NotificationSeverity) => void;
};

const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notification, setNotification] = useState<{
    message: string;
    severity: NotificationSeverity;
    open: boolean;
  }>({
    message: "",
    severity: "success",
    open: false,
  });

  const notify = useCallback(
    (message: string, severity: NotificationSeverity = "success") => {
      setNotification({ message, severity, open: true });
    },
    []
  );

  const handleClose = () => {
    setNotification((current) => ({
      ...current,
      open: false,
    }));
  };

  const contextValue = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }

  return context;
}
