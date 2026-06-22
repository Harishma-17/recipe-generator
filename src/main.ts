import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

async function getRecipeImage(recipeName: string) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(recipeName)}&per_page=1`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  const data = await response.json();

  if (data.photos && data.photos.length > 0) {
    return data.photos[0].src.medium;
  }

  return "https://via.placeholder.com/600x400?text=No+Image";
}
document.querySelector('#app')!.innerHTML = `
<div style="
padding:20px;
font-family:Arial;
max-width:900px;
margin:auto;
text-align:center;
">
 <img
src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
width="100%"
style="height:250px;object-fit:cover;border-radius:15px;"
/>
<h1>🍲 AI Recipe Generator</h1>

  <p>Enter ingredients and get recipe ideas.</p>

  <input
    id="ingredients"
    type="text"
    placeholder="Example: tomato, onion, egg"
    style="padding:10px;width:300px;"
  />

  <br><br>
  <button
id="generateBtn"
style="
padding:12px 24px;
background:#ff6b35;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
"
>

    Generate Recipe
  </button>

  <div id="result" style="margin-top:20px;"></div>
</div>
`;

const button = document.getElementById("generateBtn");
const result = document.getElementById("result");

button?.addEventListener("click", async () => {
  const ingredients = (
    document.getElementById("ingredients") as HTMLInputElement
  ).value;

  result!.innerHTML = "Generating recipe...";

  try {
const prompt = `
Using these ingredients: ${ingredients}
Generate exactly 3 recipes.

Return ONLY valid JSON.

Example format:

[
 {
   "name":"Fried Rice",
   "ingredients":["rice","egg"],
   "steps":["step1","step2"],
   "time":"15 mins"
 }
]


Do not include explanations.
Do not include notes.
Return only valid JSON array.
`;
const response = await groq.chat.completions.create({
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  model: "llama-3.3-70b-versatile",
});
const content = response.choices[0].message.content || "[]";

console.log(content);
const recipes = JSON.parse(content);
  

const recipesWithImages = await Promise.all(
  recipes.map(async (r: any) => ({
    ...r,
    image: await getRecipeImage(r.name)
  }))
);
result!.innerHTML = `
<div
style="
background:white;
padding:25px;
border-radius:15px;
box-shadow:0px 4px 15px rgba(0,0,0,0.15);
margin-top:20px;
"
>

<h2>🍽 Recipe Suggestions</h2>

<h3>🥗 Ingredients Used</h3>

<p style="
font-size:18px;
font-weight:bold;
color:#ff6b35;
">
${ingredients}
</p>

${recipesWithImages.map((r: any) => `
<div style="border:1px solid #ddd;padding:15px;border-radius:10px;margin:15px 0;">
  <h3>${r.name}</h3>

  <img
  src="${r.image}"
  style="width:100%;max-height:250px;object-fit:cover;border-radius:10px;"
  />

  <p style="text-align:left;"><b>Ingredients:</b></p>

  <ul style="text-align:left;">
    ${r.ingredients.map((i: string) => `<li>${i}</li>`).join("")}
  </ul>
  <p style="text-align:left;"><b>Steps:</b></p>
  <ol style="text-align:left;">
    ${r.steps.map((s: string) => `<li>${s}</li>`).join("")}
  </ol>

  <p><b>Cooking Time:</b> ${r.time}</p>
</div>
`).join("")}

</div>
`;

} catch (error: any) {
  console.log(error);
  result!.innerHTML = error.message;
}
});