import { EMAIL_CONFIG } from "./emailConfig.js";

export function infoCard(rows) {
  return `
    <div class="card">
      <table width="100%">
        ${rows
          .map(
            (row) => `
            <tr>
              <td><strong>${row.label}</strong></td>
              <td align="right">${row.value}</td>
            </tr>
        `
          )
          .join("")}
      </table>
    </div>
  `;
}

export function button(text, url) {
  return `
      <a
        href="${url}"
        class="button"
      >
        ${text}
      </a>
  `;
}

export function divider() {
  return `<hr class="divider"/>`;
}
