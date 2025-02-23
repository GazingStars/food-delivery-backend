document.getElementById("orderFoodBtn").addEventListener("click", async () => {
    const selectedItems = [];
    const rows = document.querySelectorAll("#menuList > div");

    rows.forEach(row => {
        const checkbox = row.querySelector("input[type='checkbox']");
        const quantityInput = row.querySelector("input[type='number']");

        if (checkbox.checked) {
            selectedItems.push({
                item_id: parseInt(checkbox.value, 10),
                quantity: parseInt(quantityInput.value, 10)
            });
        }
    });

    const user_id = parseInt(localStorage.getItem("loggedUser"));

    if (selectedItems.length > 0) {
        console.log("Заказ:", selectedItems);
        alert("Заказ принят! Проверьте консоль для деталей.");
        console.log(user_id);
        const response = await fetch("http://localhost:3000/CreateOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({user_id, items: selectedItems })
        });
        
        if (response.ok) {
            const menu = await response.json();
            console.log("Ответ сервера:", menu);
        }

    } else {
        alert("Пожалуйста, выберите хотя бы одно блюдо.");
    }
});
