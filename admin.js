
function openNav() {
document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
document.getElementById("mySidenav").style.width = "0";
}






document.getElementById('insertForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const id = document.getElementById('id').value;
    const price = document.getElementById('price').value;
    const color = document.getElementById('color').value;
    const imageFile = document.getElementById('imageFile').value;
    const name = document.getElementById('name').value;
    const des = document.getElementById('des').value;

    try {
        const response = await fetch('http://localhost:3000/insert_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, price, color, imageFile,name,des })
        });
        const result = await response.json();
        document.getElementById('message').textContent = result.message || 'Item inserted successfully';
    } catch (error) {
        console.error('Error inserting item:', error);
        document.getElementById('message').textContent = 'Error inserting item';
    }
});

document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const id = document.getElementById('deleteId').value;

    try {
        const response = await fetch('http://localhost:3000/delete_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        const result = await response.json();
        document.getElementById('message').textContent = result.message || 'Item deleted successfully';
    } catch (error) {
        console.error('Error deleting item:', error);
        document.getElementById('message').textContent = 'Error deleting item';
    }
});