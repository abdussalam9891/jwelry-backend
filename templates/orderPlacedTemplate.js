import { emailLayout } from "./layout/emailLayout.js";

import { infoCard } from "./layout/components.js";

export function getOrderPlacedTemplate({

customerName,

orderNumber,

}) {

return emailLayout({

title:"Order Confirmed",

preheader:"Your Gemora order has been confirmed.",

content:`

<h2 style="color:#6B1A2A;">

Order Confirmed 🎉

</h2>

<p>

Hi <strong>${customerName}</strong>,

</p>

<p>

Thank you for shopping with Gemora.

We've received your order and have started preparing it.

</p>

${infoCard([

{

label:"Order Number",

value:orderNumber,

},

])}

<p>

We'll notify you again as soon as your order ships.

</p>

`,

});

}
