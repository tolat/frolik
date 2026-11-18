// Email templates, styled like the app: pale page, white rounded card with
// the five category colours along the top, the "frolik" wordmark, a blue
// pill button. Built from tables with inline styles so Gmail, Apple Mail
// and Outlook all render it (no flex/grid, no external CSS, no images other
// than the logo, which is served from the site itself).
// Every template takes the RECIPIENT's language first (i18n userLang(user)).
const { tr } = require("./i18n");

const SITE = (process.env.SERVER || "https://www.frolik.ca").replace(/\/$/, "");
const LOGO_URL = `${SITE}/email/frolik-logo.png`;
const APP_ICON_URL = `${SITE}/email/app-icon.png`;
// Opens the site with the "Get the Frolik app" drawer showing
const INSTALL_URL = `${SITE}/?install=1`;

const C = {
  page: "#F4F6FA",
  card: "#FFFFFF",
  text: "#1B1D24",
  muted: "#6B7180",
  faint: "#9AA0AE",
  panel: "#F4F6FA",
  blue: "#4A7EE8",
  blueLight: "#6A9BF5",
  stripe: ["#F89D9D", "#BAFFA9", "#EEB7DC", "#75CCFF", "#FFEC45"], // categories
};
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const escape = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

module.exports.genResetPasswordEmail = (lang, link) =>
  basicEmailTemplate(lang, {
    header: tr(lang, "email.resetPassword.header"),
    content: paragraph(tr(lang, "email.resetPassword.body")),
    buttonLink: link,
    buttonText: tr(lang, "email.resetPassword.button"),
    footerText: tr(lang, "email.resetPassword.footer"),
    showLink: true,
  });

module.exports.genVerifyAccountEmail = (lang, link) =>
  basicEmailTemplate(lang, {
    header: tr(lang, "email.verify.header"),
    content: paragraph(tr(lang, "email.verify.body")),
    buttonLink: link,
    buttonText: tr(lang, "email.verify.button"),
    footerText: tr(lang, "email.verify.footer"),
    showLink: true,
    getApp: true,
  });

// The activity + outing name in a soft panel (invites)
const outingPanel = (lang, outing) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 4px 0 8px;">
    <tr>
      <td style="background: ${C.panel}; border-radius: 14px; padding: 16px 18px;">
        <div style="font-family: ${FONT}; font-size: 18px; font-weight: 800; color: ${C.text}; line-height: 1.3;">
          ${escape(outing?.activity?.name)}
        </div>
        <div style="font-family: ${FONT}; font-size: 13px; color: ${C.muted}; margin-top: 4px;">
          ${escape(tr(lang, "email.outingName", { name: outing?.name }))}
        </div>
      </td>
    </tr>
  </table>`;

module.exports.genOutingInviteAcceptedEmail = (lang, by, outing, unreadAlerts, unreadChats) =>
  basicEmailTemplate(lang, {
    header: tr(lang, "email.inviteAccepted.header"),
    content:
      paragraph(tr(lang, "email.inviteAccepted.body", { name: `${by.first_name} ${by.last_name}` })) +
      outingPanel(lang, outing),
    buttonLink: `${SITE}/profile`,
    buttonText: tr(lang, "email.viewOnSite"),
    unreadAlerts,
    unreadChats,
    getApp: true,
  });

module.exports.genOutingInviteEmail = (lang, from, outing, unreadAlerts = 0, unreadChats = 0) =>
  basicEmailTemplate(lang, {
    header: tr(lang, "email.invite.header"),
    content:
      paragraph(tr(lang, "email.invite.body", { name: `${from.first_name} ${from.last_name}` })) +
      outingPanel(lang, outing),
    buttonLink: `${SITE}/alerts`,
    buttonText: tr(lang, "email.viewOnSite"),
    unreadAlerts,
    unreadChats,
    getApp: true,
  });

module.exports.dailyUpdateEmail = (lang, unreadAlerts, unreadChats) =>
  basicEmailTemplate(lang, {
    header: tr(lang, "email.daily.header"),
    content: paragraph(tr(lang, "email.daily.intro")),
    buttonLink: SITE,
    buttonText: tr(lang, "email.viewOnSite"),
    unreadAlerts,
    unreadChats,
    getApp: true,
  });

const paragraph = (text) =>
  `<p style="margin: 0 0 18px; font-family: ${FONT}; font-size: 16px; line-height: 1.55; color: ${C.muted};">${escape(text)}</p>`;

// Pill button: a table cell with a background colour (Outlook) and a
// gradient on top for everyone else
const button = (href, text) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 10px 0 6px;">
    <tr>
      <td align="center" bgcolor="${C.blue}" style="border-radius: 999px; background: ${C.blue}; background-image: linear-gradient(135deg, ${C.blueLight} 0%, ${C.blue} 100%); box-shadow: 0 6px 16px rgba(74, 126, 232, 0.3);">
        <a href="${escape(href)}" target="_blank" style="display: inline-block; padding: 15px 34px; font-family: ${FONT}; font-size: 16px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 999px;">
          ${escape(text)}
        </a>
      </td>
    </tr>
  </table>`;

function basicEmailTemplate(
  lang,
  { header, content, buttonLink, buttonText, footerText = "", showLink = false, unreadAlerts = 0, unreadChats = 0, getApp = false }
) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const align = dir === "rtl" ? "right" : "left";
  const stripe = C.stripe
    .map((c) => `<td height="6" style="height: 6px; background: ${c}; font-size: 0; line-height: 0;">&nbsp;</td>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="${escape(lang || "en")}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escape(header)}</title>
</head>
<body style="margin: 0; padding: 0; background: ${C.page};">
  <!-- inbox preview text -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${escape(header)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background: ${C.page};">
    <tr>
      <td align="center" style="padding: 32px 16px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px;">
          <!-- logo -->
          <tr>
            <td align="center" style="padding: 0 0 22px;">
              <a href="${SITE}" target="_blank" style="text-decoration: none;">
                <img src="${LOGO_URL}" width="132" alt="frolik" style="display: block; width: 132px; height: auto; border: 0; font-family: ${FONT}; font-size: 28px; font-weight: 800; color: ${C.text};" />
              </a>
            </td>
          </tr>
          <!-- card -->
          <tr>
            <td style="background: ${C.card}; border-radius: 22px; overflow: hidden; box-shadow: 0 8px 24px rgba(27, 29, 36, 0.08);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${stripe}</tr></table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="${dir}">
                <tr>
                  <td align="${align}" style="padding: 32px 32px 30px; text-align: ${align};">
                    <h1 style="margin: 0 0 14px; font-family: ${FONT}; font-size: 25px; line-height: 1.25; font-weight: 800; letter-spacing: -0.02em; color: ${C.text};">
                      ${escape(header)}
                    </h1>
                    ${content}
                    ${button(buttonLink, buttonText)}
                    ${
                      showLink
                        ? `<p style="margin: 16px 0 0; font-family: ${FONT}; font-size: 12px; line-height: 1.5; color: ${C.faint};">
                            ${escape(tr(lang, "email.linkHint"))}<br />
                            <a href="${escape(buttonLink)}" target="_blank" style="color: ${C.blue}; word-break: break-all;">${escape(buttonLink)}</a>
                          </p>`
                        : ""
                    }
                    ${alertsSection(lang, unreadAlerts, unreadChats)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${getApp ? getAppSection(lang, dir, align) : ""}
          <!-- footer -->
          <tr>
            <td align="center" style="padding: 22px 12px 0; font-family: ${FONT}; font-size: 12px; line-height: 1.55; color: ${C.faint};">
              ${footerText ? `${escape(footerText)}<br /><br />` : ""}
              ${escape(tr(lang, "email.brandLine"))}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Unread counts as small pills (no external icons)
function alertsSection(lang, unreadAlerts = 0, unreadChats = 0) {
  const pill = (emoji, text) =>
    `<span style="display: inline-block; margin: 0 6px 6px 0; padding: 7px 12px; border-radius: 999px; background: ${C.panel}; font-family: ${FONT}; font-size: 13px; font-weight: 600; color: ${C.text};">${emoji}&nbsp; ${escape(text)}</span>`;
  const pills = [
    unreadAlerts > 0 ? pill("🔔", tr(lang, "email.unreadAlerts", { count: unreadAlerts })) : "",
    unreadChats > 0 ? pill("💬", tr(lang, "email.unreadChats", { count: unreadChats })) : "",
  ].join("");
  return pills ? `<div style="margin-top: 22px;">${pills}</div>` : "";
}

// "Get the Frolik app": app icon, a line on why, and a button that opens the
// site with the install drawer (/?install=1)
function getAppSection(lang, dir, align) {
  return `
          <tr>
            <td style="padding: 16px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="${dir}" style="background: ${C.card}; border-radius: 18px;">
                <tr>
                  <td width="72" valign="middle" style="padding: 16px 0 16px 16px; padding-inline-start: 16px;">
                    <img src="${APP_ICON_URL}" width="56" height="56" alt="" style="display: block; width: 56px; height: 56px; border-radius: 13px; border: 0;" />
                  </td>
                  <td valign="middle" align="${align}" style="padding: 16px 12px; text-align: ${align}; font-family: ${FONT};">
                    <div style="font-size: 15px; font-weight: 800; color: ${C.text};">${escape(tr(lang, "email.getApp.title"))}</div>
                    <div style="font-size: 13px; line-height: 1.45; color: ${C.muted}; margin-top: 2px;">${escape(tr(lang, "email.getApp.body"))}</div>
                  </td>
                  <td valign="middle" style="padding: 16px 16px 16px 0;">
                    <a href="${INSTALL_URL}" target="_blank" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: ${C.panel}; font-family: ${FONT}; font-size: 13px; font-weight: 700; color: ${C.blue}; text-decoration: none; white-space: nowrap;">
                      ${escape(tr(lang, "email.getApp.button"))}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}
