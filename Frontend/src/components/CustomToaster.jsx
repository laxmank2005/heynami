import React from "react";
import { toast, Toaster, useToasterStore } from "react-hot-toast";

/* ─── Icons ──────────────────────────────────────────────────── */
const SuccessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="#203a27"/>
    <circle cx="12" cy="12" r="7" fill="#22c55e"/>
    <path d="M9.5 12.5L11 14L15 10" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="#3f1c1c"/>
    <circle cx="12" cy="12" r="7" fill="#ef4444"/>
    <path d="M10 10L14 14M14 10L10 14" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="8" stroke="#3b82f6" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);

/* ─── Single Toast Card ──────────────────────────────────────── */
const ToastCard = ({ t }) => {
  const isError = t.type === "error";
  const isLoading = t.type === "loading";
  const isSuccess = t.type === "success";

  const message =
    typeof t.message === "function"
      ? t.message(t)
      : typeof t.message === "string"
      ? t.message
      : String(t.message ?? "");

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
        transition: "opacity 200ms ease, transform 200ms ease",
        willChange: "opacity, transform",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "12px 16px 12px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "Inter, system-ui, sans-serif",
        lineHeight: "1.4",
        maxWidth: "400px",
        minWidth: "300px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        background: "#1e1e1e",
        color: "#ffffff",
        cursor: "default",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        {/* Icon */}
        <div style={{ flexShrink: 0, display: "flex" }}>
          {isSuccess && <SuccessIcon />}
          {isError && <ErrorIcon />}
          {isLoading && <LoadingIcon />}
          {!isSuccess && !isError && !isLoading && <SuccessIcon />}
        </div>

        {/* Message */}
        <span style={{ flex: 1, userSelect: "text" }}>{message}</span>
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => { e.stopPropagation(); toast.dismiss(t.id); }}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          color: "#9ca3af",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          transition: "color 150ms",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#f3f4f6")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

/* ─── Custom Toaster Container ────────────────────────────────── */
const CustomToaster = () => {
  const { toasts } = useToasterStore();

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "flex-end",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {toasts
        .filter((t) => t.visible)
        .slice(0, 4)
        .map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastCard t={t} />
          </div>
        ))}
    </div>
  );
};

export default CustomToaster;
