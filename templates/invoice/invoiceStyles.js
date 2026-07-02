import { INVOICE_CONFIG } from "./invoiceConfig.js";

export const invoiceStyles = `

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:Arial, Helvetica, sans-serif;
  font-size:10px;
  line-height:1.25;
  background:${INVOICE_CONFIG.background};
  color:${INVOICE_CONFIG.text};
  padding:16px;
}

/* ================= HEADER ================= */

.header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  border-bottom:1px solid ${INVOICE_CONFIG.border};
  padding-bottom:12px;
  margin-bottom:16px;
}

.brand{
  max-width:50%;
}

.logo{
  font-size:28px;
  font-weight:700;
  letter-spacing:4px;
  color:${INVOICE_CONFIG.text};
}

.tagline{
  margin-top:2px;
  font-size:10px;
  color:${INVOICE_CONFIG.muted};
}

.invoice-meta{
  text-align:right;
}

.invoice-title{
  font-family:Georgia,"Times New Roman",serif;
  font-size:26px;
  font-weight:700;
  color:${INVOICE_CONFIG.text};
  margin-bottom:6px;
}

.meta-row{
  margin-bottom:2px;
}

/* ================= SECTION ================= */

.section{
  margin-top:14px;
}

.section-title{
  font-size:10px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:1px;
  color:${INVOICE_CONFIG.accent};
  border-bottom:1px solid ${INVOICE_CONFIG.border};
  padding-bottom:4px;
  margin-bottom:8px;
}

/* ================= GRID ================= */

.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.card{
  border:1px solid ${INVOICE_CONFIG.border};
  background:#fff;
  padding:10px;
}

.address{
  line-height:1.4;
}

/* ================= TABLE ================= */

table{
  width:100%;
  border-collapse:collapse;
  margin-top:8px;
  border:1px solid ${INVOICE_CONFIG.border};
}

thead{
  background:${INVOICE_CONFIG.lightBackground};
  color:${INVOICE_CONFIG.text};
}

th{
  padding:8px 6px;
  text-align:left;
  font-size:10px;
  font-weight:700;
  border-bottom:1px solid ${INVOICE_CONFIG.border};
}

td{
  padding:7px 6px;
  border-bottom:1px solid ${INVOICE_CONFIG.border};
  vertical-align:top;
}

tbody tr:nth-child(even){
  background:${INVOICE_CONFIG.lightBackground};
}

/* ================= TOTALS ================= */

.totals{
  width:280px;
  margin-top:14px;
  margin-left:auto;
  border:none;
}

.totals td{
  border:none;
  padding:5px 6px;
}

.total-label{
  font-weight:600;
}

.grand{
  font-size:14px;
  font-weight:700;
  color:${INVOICE_CONFIG.text};
  border-top:2px solid ${INVOICE_CONFIG.text};
}

.grand td{
  background:${INVOICE_CONFIG.lightBackground};
  padding-top:10px;
}

/* ================= BADGES ================= */

.badge{
  display:inline-block;
  padding:4px 10px;
  border:1px solid ${INVOICE_CONFIG.border};
  background:${INVOICE_CONFIG.lightBackground};
  color:${INVOICE_CONFIG.text};
  border-radius:20px;
  font-size:11px;
  font-weight:600;
}

.success,
.danger{
  background:${INVOICE_CONFIG.lightBackground};
  color:${INVOICE_CONFIG.text};
}

/* ================= NOTICE ================= */

.notice{
  margin-top:22px;
  padding:14px;
  
  line-height:1.7;
}

/* ================= SUPPORT ================= */

.support{
  margin-top:20px;
  padding-top:14px;
  border-top:1px solid ${INVOICE_CONFIG.border};
  font-size:12px;
  line-height:1.6;
}

/* ================= FOOTER ================= */

.footer{
  margin-top:18px;
  padding-top:10px;
  border-top:1px solid ${INVOICE_CONFIG.border};
  text-align:center;
  font-size:10px;
  color:${INVOICE_CONFIG.muted};
  line-height:1.6;
}

/* ================= LINKS ================= */

a{
  color:${INVOICE_CONFIG.text};
  text-decoration:none;
}

a:hover{
  text-decoration:underline;
}

/* ================= PRINT ================= */

@page{
  size:A4;
  margin:10mm;
}

@media print{

  body{
    padding:0;
  }

  *{
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }

}
`;
