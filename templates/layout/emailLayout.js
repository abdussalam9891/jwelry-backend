import { EMAIL_CONFIG } from "./emailConfig.js";

export function emailLayout({

  title,

  preheader = "",

  content,

}) {

return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
/>

<title>${title}</title>

<style>

body{

margin:0;

padding:0;

background:${EMAIL_CONFIG.background};

font-family:Arial,sans-serif;

color:#333;

}

.wrapper{

max-width:640px;

margin:40px auto;

background:white;

border-radius:14px;

overflow:hidden;

}

.header{

padding:35px;

text-align:center;

border-bottom:1px solid #eee;

}

.logo{

font-size:34px;

letter-spacing:5px;

font-weight:bold;

color:${EMAIL_CONFIG.primary};

}

.tagline{

margin-top:8px;

color:${EMAIL_CONFIG.accent};

font-size:14px;

}

.content{

padding:40px;

line-height:1.8;

}

.card{

background:#FAFAFA;

padding:22px;

border-radius:12px;

margin:30px 0;

}

.button{

display:inline-block;

padding:14px 28px;

background:${EMAIL_CONFIG.primary};

color:white !important;

text-decoration:none;

border-radius:8px;

font-weight:bold;

margin-top:20px;

}

.notice{

background:#FFF8EF;

border-left:4px solid ${EMAIL_CONFIG.accent};

padding:20px;

margin-top:30px;

}

.support{

margin-top:40px;

padding:24px;

background:#F7F7F7;

border-radius:12px;

}

.footer{

padding:30px;

font-size:13px;

text-align:center;

color:#777;

border-top:1px solid #eee;

}

.divider{

border:none;

border-top:1px solid #eee;

margin:30px 0;

}

</style>

</head>

<body>

<span
style="
display:none;
visibility:hidden;
opacity:0;
height:0;
width:0;
"
>

${preheader}

</span>

<div class="wrapper">

<div class="header">

<div class="logo">

${EMAIL_CONFIG.brandName}

</div>

<div class="tagline">

${EMAIL_CONFIG.tagline}

</div>

</div>

<div class="content">

${content}

<div class="support">

<h3 style="margin-top:0;color:${EMAIL_CONFIG.primary};">

Need Help?

</h3>

<p>

📧 ${EMAIL_CONFIG.supportEmail}

</p>

<p>

📞 ${EMAIL_CONFIG.supportPhone}

</p>

<p>

${EMAIL_CONFIG.hours}

</p>

</div>

</div>

<div class="footer">

${EMAIL_CONFIG.copyright}

<br><br>

Thank you for choosing Gemora.

</div>

</div>

</body>

</html>

`;

}
