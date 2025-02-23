document.getElementById("showMenu").addEventListener("click", async () => {
    const response = await fetch("http://localhost:3000/menu", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (response.ok) {
      const menu = await response.json();
      console.log("Список блюд:", menu);

      const menuContainer = document.getElementById("menuList");
      menuContainer.innerHTML = ""; 

      menu.forEach(item => {

          const row = document.createElement("div");
          row.className = "d-flex align-items-center mb-2";

   
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = `menu-item-${item.id}`;
          checkbox.value = item.item_id;
          checkbox.className = "me-2";

  
          const label = document.createElement("label");
          label.htmlFor = `menu-item-${item.id}`;
          label.textContent = `${item.name} - ${item.price} ₽`;
          label.className = "me-3";


          const quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.placeholder = "Кол-во";
          quantityInput.min = "1";
          quantityInput.value = "1";
          quantityInput.style.width = "80px";
          quantityInput.disabled = true; 


          checkbox.addEventListener("change", function () {
              quantityInput.disabled = !checkbox.checked;
          });


          row.appendChild(checkbox);
          row.appendChild(label);
          row.appendChild(quantityInput);


          menuContainer.appendChild(row);
      });

    } else {
      console.error("Ошибка получения меню:", response.status);
    }
  });
  