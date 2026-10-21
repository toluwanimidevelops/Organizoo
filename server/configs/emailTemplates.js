import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const load = (name) =>
  fs.readFileSync(path.join(__dirname, "../templates", name), "utf8");

// Read once when the server starts
const otpTemplate = load("otp.html");
const welcomeTemplate = load("welcome.html");

const escapeHtml = (str = "") =>
  String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const fill = (template, values) =>
  template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => values[key] ?? "");

const CLIENT_URL =
  process.env.CLIENT_URL || "https://connectify-app-nu.vercel.app";

const common = () => ({
  help_url: process.env.HELP_URL || CLIENT_URL,
  year: new Date().getFullYear(),
  company_address: process.env.COMPANY_ADDRESS || "",
});

export const renderOtpEmail = ({ firstName, otp, expiryMinutes = 10 }) =>
  fill(otpTemplate, {
    ...common(),
    first_name: escapeHtml(firstName),
    otp_code: otp,
    expiry_minutes: expiryMinutes,
  });

export const renderWelcomeEmail = ({ firstName }) =>
  fill(welcomeTemplate, {
    ...common(),
    first_name: escapeHtml(firstName),
    preheader: "Your account is ready. Here's how to get started.",
    login_url: `${CLIENT_URL}/login`,
    explore_url: `${CLIENT_URL}/explore`,
    create_event_url: `${CLIENT_URL}/create-event`,
    cta_url: `${CLIENT_URL}/explore`,
    cta_label: "Explore events",
    unsubscribe_url: `${CLIENT_URL}/unsubscribe`,
  });
