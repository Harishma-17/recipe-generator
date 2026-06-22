import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

Return ONLY valid HTML.

Do not include explanations.
Do not include notes.
Do not repeat instructions.
Do not write any text outside HTML.
For each recipe create:

<div style="border:1px solid #ddd;padding:15px;border-radius:10px;margin:15px 0;">
<img src="https://picsum.photos/600/400" style="width:100%;border-radius:10px;">
<h3>🍲 Recipe Name</h3>
<p><b>🥕 Ingredients:</b></p>
<ul>
<li>Ingredient</li>
</ul>

<p><b>👨‍🍳 Steps:</b></p>
<ol>
<li>Step</li>
</ol>

<p><b>⏱ Cooking Time:</b></p>
</div>

Create 3 separate recipe cards.
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
const recipe = response.choices[0].message.content || "";
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

<div
style="
text-align:left;
font-size:16px;
line-height:1.8;
background:#fafafa;
padding:20px;
border-radius:10px;
margin-top:15px;
"
>
${recipe}
</div>
</div>
`;

} catch (error: any) {
  console.log(error);
  result!.innerHTML = error.message;
}
});