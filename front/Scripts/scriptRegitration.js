document.getElementById("RegBTN").addEventListener("click", async () => {
  const name = document.getElementById("Name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  regObj = {
    _name: name,
    _phone: phone,
    _email: email,
  };

  const jsonString = JSON.stringify(regObj);

  try {
    var response = await fetch("http://localhost:3000/RegisterUser", {
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
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
});
