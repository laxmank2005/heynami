import React from "react";
import { toast, Toaster, useToasterStore } from "react-hot-toast";

/* ─── Icons ──────────────────────────────────────────────────── */
const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="url(#sg)" />
    <path d="M4.5 8l2.25 2.25L11.5 5.75" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="url(#eg)" />
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <defs>
      <linearGradient id="eg" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f87171" />
        <stop offset="1" stopColor="#dc2626" />
      </linearGradient>
    </defs>
  </svg>
);

const LoadingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
    <circle cx="8" cy="8" r="6" stroke="#6366f1" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
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
        transform: t.visible ? "translateX(0) scale(1)" : "translateX(20px) scale(0.97)",
        transition: "opacity 220ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 15px 11px 13px",
        borderRadius: "12px",
        fontSize: "13.5px",
        fontWeight: "500",
        fontFamily: "Inter, system-ui, sans-serif",
        letterSpacing: "-0.01em",
        lineHeight: "1.4",
        maxWidth: "340px",
        minWidth: "220px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
        background: isError
          ? "linear-gradient(135deg,#1a0c0c 0%,#1c1010 100%)"
          : "linear-gradient(135deg,#111118 0%,#13131a 100%)",
        border: isError
          ? "1px solid rgba(220,38,38,0.22)"
          : isSuccess
          ? "1px solid rgba(52,211,153,0.18)"
          : "1px solid rgba(255,255,255,0.08)",
        color: "#e8e8ed",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}
      onClick={() => toast.dismiss(t.id)}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: "2.5px",
          borderRadius: "0 2px 2px 0",
          background: isError
            ? "linear-gradient(to bottom, #f87171, #dc2626)"
            : isSuccess
            ? "linear-gradient(to bottom, #34d399, #059669)"
            : "linear-gradient(to bottom, #818cf8, #6366f1)",
        }}
      />

      {/* Icon */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", marginLeft: "6px" }}>
        {isSuccess && <SuccessIcon />}
        {isError && <ErrorIcon />}
        {isLoading && <LoadingIcon />}
        {!isSuccess && !isError && !isLoading && <SuccessIcon />}
      </div>

      {/* Message */}
      <span style={{ flex: 1, userSelect: "none" }}>{message}</span>

      {/* Dismiss button */}
      <button
        onClick={(e) => { e.stopPropagation(); toast.dismiss(t.id); }}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          color: "rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          borderRadius: "4px",
          transition: "color 150ms",
          marginLeft: "2px",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {/* Progress bar (for auto-dismiss) */}
      {!isLoading && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1.5px",
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: isError
                ? "linear-gradient(90deg, #f87171, #dc2626)"
                : isSuccess
                ? "linear-gradient(90deg, #34d399, #059669)"
                : "linear-gradient(90deg, #818cf8, #6366f1)",
              animation: `shrink ${t.duration ?? 3000}ms linear forwards`,
            }}
          />
          <style>{`@keyframes shrink { from { transform: scaleX(1); transform-origin: left; } to { transform: scaleX(0); transform-origin: left; } }`}</style>
        </div>
      )}
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
