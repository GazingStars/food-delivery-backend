document.getElementById("postSmth").addEventListener("click", async () => {
  const title = document.getElementById("Title").value;
  const priceN = parseFloat(document.getElementById("Price").value);

  postOb = {
    name: title,
    price: priceN,
  };

  const jsonString = JSON.stringify(postOb);

  var response = await fetch("http://localhost:3000/api/dishesMG", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonString,
  });

  if (response.ok) {
    const menu = await response.json();
    console.log("Ответ сервера:", menu);
  } else {
    console.error("Ошибка:", response.status);
  }

});
