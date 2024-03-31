window.addEventListener('DOMContentLoaded', () => {
    const candyForm = document.getElementById('candyForm');
    const candyList = document.getElementById('candyList');

    // Fetch candies from CRUD API and display them
    axios.get("https://crudcrud.com/api/8e1e9fae2ea14cada054d48c8e7d3e55/candyshop")
        .then(response => {
            response.data.forEach(candy => displayCandyOnScreen(candy));
        })
        .catch(error => console.error("Error fetching candies:", error));

    candyForm.addEventListener('submit', event => {
        event.preventDefault();
        const candyData = {
            name: candyForm.candyName.value,
            description: candyForm.candyDescription.value,
            price: parseFloat(candyForm.candyPrice.value),
            quantity: parseInt(candyForm.candyQuantity.value)
        };

        // Add or edit candy based on whether edit mode is active
        if (editMode) {
            axios.put(`https://crudcrud.com/api/8e1e9fae2ea14cada054d48c8e7d3e55/candyshop/${editedCandy._id}`, candyData)
                .then(response => {
                    editMode = false;
                    editedCandy = null;
                })
                .catch(error => console.error("Error editing candy:", error));
        } else {
            axios.post("https://crudcrud.com/api/8e1e9fae2ea14cada054d48c8e7d3e55/candyshop", candyData)
                .then(response => {
                    displayCandyOnScreen(response.data);
                })
                .catch(error => console.error("Error adding candy:", error));
        }
    });

    let editMode = false;
    let editedCandy = null;

    function displayCandyOnScreen(candy) {
        const candyItem = document.createElement('li');
        candyItem.innerHTML = `
            <strong>${candy.name}</strong> - ${candy.description} - Price: ${candy.price} - Quantity: ${candy.quantity}
            <button class="editBtn" data-id="${candy._id}">Edit</button>
            <button class="deleteBtn" data-id="${candy._id}">Delete</button>
        `;
        candyList.appendChild(candyItem);

        const editBtn = candyItem.querySelector('.editBtn');
        editBtn.addEventListener('click', () => {
            editMode = true;
            editedCandy = candy;
            populateForm(candy);
        });

        const deleteBtn = candyItem.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', () => {
            axios.delete(`https://crudcrud.com/api/8e1e9fae2ea14cada054d48c8e7d3e55/candyshop/${candy._id}`)
                .then(() => {
                    candyList.removeChild(candyItem);
                })
                .catch(error => console.error("Error deleting candy:", error));
        });
    }

    function populateForm(candy) {
        candyForm.candyName.value = candy.name;
        candyForm.candyDescription.value = candy.description;
        candyForm.candyPrice.value = candy.price;
        candyForm.candyQuantity.value = candy.quantity;
        document.getElementById('addItemBtn').style.display = 'none';
        document.getElementById('editItemBtn').style.display = 'inline-block';
        document.getElementById('deleteItemBtn').style.display = 'inline-block';
    }
});