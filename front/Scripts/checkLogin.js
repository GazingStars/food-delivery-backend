document.getElementById("LogBTN").addEventListener("click", async () => {
  const _name = document.getElementById("Name").value;
  const orderContainer = document.getElementById("orderContainer");
  const logoutBtn = document.getElementById("logoutBtn");

  const response = await fetch("http://localhost:3000/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const users = await response.json();
    const matchedUser = users.find((user) => user.name === _name);

    if (matchedUser) {
      console.log("Найден пользователь:", matchedUser);

      localStorage.setItem("loggedUser", matchedUser.user_id);
      alert("Логин сохранен!");

      document.getElementById("loginSection").style.display = "none";

      document.getElementById("orderSection").style.display = "flex";
    } else {
      alert("Пользователь не найден!");
    }
  } else {
    console.error("Ошибка:", response.status);
  }
});
