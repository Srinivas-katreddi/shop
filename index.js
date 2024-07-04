function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function addToCart(item) {
    try {
        const { _id, name, des, price, color, image } = item;

        // Convert image data to a base64 string
        const imageBase64 = `data:image/jpeg;base64,${btoa(new Uint8Array(image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Add new item to cart
        const cartItem = { _id, name, des, price, color, image: imageBase64, quantity: 1 };
        cart.push(cartItem);

        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart display
        displayCartItems();

        // Alert user
        alert('Item added to cart successfully!');
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
}



    
function calculateTotalItems(cartItems) {
    var totalItems = 0;
    cartItems.forEach(function(item) {
        totalItems += item.quantity;
    });
    return totalItems;
}

document.addEventListener('DOMContentLoaded', function() {
    var cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    var cartCount = document.getElementById('cartCount');
    cartCount.textContent = calculateTotalItems(cartItems);
});

