import { INVOICE_CONFIG } from "./invoiceConfig.js";

export const invoiceStyles = `

*{

margin:0;

padding:0;

box-sizing:border-box;

}

body{

font-family:Arial,sans-serif;

font-size:13px;

line-height:1.6;

background:${INVOICE_CONFIG.background};

color:${INVOICE_CONFIG.text};

padding:36px;

}

/* ---------------- HEADER ---------------- */

.header{

display:flex;

justify-content:space-between;

align-items:flex-start;

padding-bottom:24px;

border-bottom:2px solid ${INVOICE_CONFIG.primary};

margin-bottom:32px;

}

.brand{

max-width:50%;

}

.logo{

font-size:34px;

font-weight:bold;

letter-spacing:5px;

color:${INVOICE_CONFIG.primary};

}

.tagline{

margin-top:6px;

font-size:14px;

color:${INVOICE_CONFIG.accent};

}

.invoice-meta{

text-align:right;

}

.invoice-title{

font-size:28px;

font-weight:bold;

color:${INVOICE_CONFIG.primary};

margin-bottom:10px;

}

.meta-row{

margin-bottom:6px;

}

/* ---------------- SECTION ---------------- */

.section{

margin-top:30px;

}

.section-title{

font-size:15px;

font-weight:bold;

color:${INVOICE_CONFIG.primary};

margin-bottom:12px;

padding-bottom:6px;

border-bottom:1px solid ${INVOICE_CONFIG.border};

}

/* ---------------- GRID ---------------- */

.grid{

display:grid;

grid-template-columns:1fr 1fr;

gap:36px;

}

.card{

background:${INVOICE_CONFIG.lightBackground};

padding:18px;

border:1px solid ${INVOICE_CONFIG.border};

border-radius:10px;

}

.address{

line-height:1.8;

}

/* ---------------- TABLE ---------------- */

table{

width:100%;

border-collapse:collapse;

margin-top:18px;

}

thead{

background:${INVOICE_CONFIG.primary};

color:white;

}

th{

padding:12px;

font-size:13px;

text-align:left;

}

td{

padding:12px;

border-bottom:1px solid ${INVOICE_CONFIG.border};

vertical-align:top;

}

tbody tr:nth-child(even){

background:#FCFCFC;

}

/* ---------------- TOTALS ---------------- */

.totals{

width:340px;

margin-left:auto;

margin-top:28px;

}

.totals td{

border:none;

padding:8px;

}

.total-label{

font-weight:500;

}

.grand{

font-size:16px;

font-weight:bold;

color:${INVOICE_CONFIG.primary};

border-top:2px solid ${INVOICE_CONFIG.primary};

}

.grand td{

padding-top:14px;

}

/* ---------------- BADGES ---------------- */

.badge{

display:inline-block;

padding:5px 12px;

border-radius:50px;

font-size:12px;

font-weight:bold;

}

.success{

background:#EAF7EC;

color:${INVOICE_CONFIG.success};

}

.danger{

background:#FCECEC;

color:${INVOICE_CONFIG.danger};

}

/* ---------------- NOTICE ---------------- */

.notice{

margin-top:36px;

padding:18px;

background:#FFF8EF;

border-left:4px solid ${INVOICE_CONFIG.accent};

line-height:1.8;

}

/* ---------------- SUPPORT ---------------- */

.support{

margin-top:36px;

padding-top:18px;

border-top:1px solid ${INVOICE_CONFIG.border};

font-size:13px;

line-height:1.8;

}

/* ---------------- FOOTER ---------------- */

.footer{

margin-top:50px;

padding-top:18px;

border-top:1px solid ${INVOICE_CONFIG.border};

font-size:12px;

text-align:center;

color:${INVOICE_CONFIG.muted};

line-height:1.8;

}

/* ---------------- PRINT ---------------- */

@page{

size:A4;

margin:24mm;

}

@media print{

body{

padding:0;

}

thead{

-webkit-print-color-adjust:exact;

print-color-adjust:exact;

}

}

`;
