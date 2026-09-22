const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


function stripCodeFences(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}


async function extractCatalogue(imageUrl) {
  if (!imageUrl) {
    throw new Error(
      "A Checkers catalogue image URL is required."
    );
  }

  const response =
    await openai.responses.create({
      model: "gpt-4o",

      input: [
        {
          role: "user",

          content: [
            {
              type: "input_text",

              text: `
You are extracting grocery promotion data from a Checkers South Africa promotional catalogue.

Inspect the catalogue image carefully.

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations.
Do not guess missing information.

Extract every grocery product promotion that is clearly visible.

Return this structure:

{
  "retailer": "Checkers",
  "products": [
    {
      "brand": string | null,
      "productName": string,
      "price": number,
      "sizeValue": number | null,
      "sizeUnit": string | null,
      "packQuantity": number | null,

      "isPromotion": true,

      "promotionType":
        "SAVE_AMOUNT" |
        "PERCENTAGE_OFF" |
        "MULTI_BUY" |
        "BUY_X_GET_Y" |
        "OTHER",

      "promotionText": string,

      "promotionalSavings": number | null,

      "confidence":
        "high" |
        "medium" |
        "low"
    }
  ]
}

IMPORTANT RULES:

1. price must be the actual advertised customer price.

Examples:

"49 99" means 49.99.

"74 99" means 74.99.

2. If the catalogue says:

SAVE R10

return:

"promotionType": "SAVE_AMOUNT"
"promotionText": "SAVE R10"
"promotionalSavings": 10


3. If it says:

SAVE 10%

return:

"promotionType": "PERCENTAGE_OFF"
"promotionText": "SAVE 10%"
"promotionalSavings": null


4. If it says:

ANY 2 FOR R60

return:

"promotionType": "MULTI_BUY"
"promotionText": "ANY 2 FOR R60"

The price field should be 60.

Do not pretend this is the price of one unit.


5. Preserve pack information.

Example:

4 x 35g

should become:

"packQuantity": 4
"sizeValue": 35
"sizeUnit": "g"


6. Example:

200g each

should become:

"packQuantity": 1
"sizeValue": 200
"sizeUnit": "g"


7. Do not extract advertising that is not a grocery product.

Ignore:

delivery subscriptions,
logos,
footer text,
T&Cs,
customer-care numbers,
app advertising,
general marketing slogans.


8. If a product name, price or promotion cannot be confidently associated with the same product, exclude it.

9. Never manufacture a missing price or size.

10. Product names should describe the actual grocery product, not catalogue slogans.

11. Use the visible catalogue itself as the source of truth.
`,
            },

            {
              type: "input_image",
              image_url: imageUrl,
            },
          ],
        },
      ],
    });

  const raw =
    response.output_text;

  if (!raw) {
    throw new Error(
      "No catalogue data was returned."
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(
      stripCodeFences(raw)
    );
  } catch (error) {
    console.error(
      "Raw catalogue response:",
      raw
    );

    throw new Error(
      "Checkers catalogue response was not valid JSON."
    );
  }

  if (
    !parsed ||
    !Array.isArray(parsed.products)
  ) {
    throw new Error(
      "Invalid Checkers catalogue structure."
    );
  }

  return parsed;
}


module.exports = {
  extractCatalogue,
};