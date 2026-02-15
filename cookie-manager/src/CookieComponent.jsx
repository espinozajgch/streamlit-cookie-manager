import React, { useEffect, useRef } from "react";
import { Streamlit, withStreamlitConnection } from "streamlit-component-lib";

function buildCookie({ name, value, days, path = "/", sameSite, secure }) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  const encName = encodeURIComponent(name);
  const encValue = encodeURIComponent(value ?? "");

  const parts = [
    `${encName}=${encValue}`,
    `expires=${expires}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (secure) parts.push("Secure");

  return parts.join("; ");
}

function getCookie(name) {
  const encName = encodeURIComponent(name);
  const match = document.cookie.match(new RegExp(`(^| )${encName}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie({ name, path = "/", sameSite, secure }) {
  const encName = encodeURIComponent(name);
  const parts = [
    `${encName}=`,
    `Max-Age=0`,
    `path=${path}`,
    `SameSite=${sameSite}`,
  ];
  if (secure) parts.push("Secure");
  document.cookie = parts.join("; ");
}

const CookieComponent = ({ args }) => {
  const readyOnce = useRef(false);
  const callId = useRef(0);

  useEffect(() => {
    // Handshake estable con Streamlit
    if (!readyOnce.current) {
      Streamlit.setComponentReady();
      // Evita 0: 0 a veces provoca comportamientos raros en iframes
      Streamlit.setFrameHeight(1);
      readyOnce.current = true;
    }
  }, []);

  useEffect(() => {
    if (!args) return;

    // Si llegan llamadas muy seguidas, nos quedamos con la última
    const myId = ++callId.current;

    const {
      action,
      name,
      value,
      days = 7,
      path = "/",
      // Permite que python decida; fallback razonable
      cookieSecure,
      sameSite,
    } = args;

    try {
      const isHttps = window.location.protocol === "https:";
      const secure = typeof cookieSecure === "boolean" ? cookieSecure : isHttps;

      // sameSite: en local suele ser mejor Lax; None requiere Secure en navegadores modernos
      const ss =
        sameSite ??
        (secure ? "None" : "Lax");

      let result = null;

      if (action === "set") {
        document.cookie = buildCookie({ name, value, days, path, sameSite: ss, secure });
        result = { ok: true, action: "set" }; // ACK inmediato
      } else if (action === "get") {
        result = { ok: true, action: "get", value: getCookie(name) };
      } else if (action === "delete") {
        deleteCookie({ name, path, sameSite: ss, secure });
        result = { ok: true, action: "delete" }; // ACK inmediato
      } else {
        result = { ok: false, error: `Unknown action: ${action}` };
      }

      // Solo respondemos si seguimos siendo la última llamada
      if (myId === callId.current) {
        Streamlit.setComponentValue(result);
      }
    } catch (e) {
      Streamlit.setComponentValue({
        ok: false,
        error: e?.message ?? String(e),
      });
    }
  }, [args]);

  return null;
};

export default withStreamlitConnection(CookieComponent);