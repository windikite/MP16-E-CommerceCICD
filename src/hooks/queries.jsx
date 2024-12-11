
export const fetchProduct = async (productId) => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`)
    if(!response.ok){
        throw new Error('Failed to fetch post')
    }
    return response.json()
}

export const fetchProducts = async ({ pageParam = 1, sortOrder = 'asc' }) => {
    const response = await fetch(`https://fakestoreapi.com/products/?page=${pageParam}&limit=50&sort=${sortOrder}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};


export const fetchAllProducts = async () => {
    const response = await fetch(`https://fakestoreapi.com/products/`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};


export const createProduct = async (product) => {
    const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    if(!response.ok) {
        throw new Error('Failed to add new post')
    }
    return response.json();
}

export const deleteProduct = async (productId) => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: 'DELETE',
    })
    if(!response.ok){
        throw new Error('Failed to delete post')
    }
    return response.json()
}

export const updateProduct = async (product) => {
    const response = await fetch(`https://fakestoreapi.com/products/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    if(!response.ok) {
        throw new Error('Failed to add new post')
    }
    return response.json();
}

export const checkOut = async (cart) => {
    const response = await fetch(`https://fakestoreapi.com/carts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    })
    if(!response.ok) {
        throw new Error('Failed to add new post')
    }
    return response.json();
}

export const logIn = async (userInfo) => {
    const response = await fetch(`https://fakestoreapi.com/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    })
    if(!response.ok) {
        throw new Error('Failed to log in')
    }
    return response.json();
}

export const createUser = async (userInfo) => {
    const response = await fetch(`https://fakestoreapi.com/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    })
    if(!response.ok) {
        throw new Error('Failed to add user')
    }
    return response.json();
}

export const fetchUser = async (id) => {
    const response = await fetch(`https://fakestoreapi.com/users/${id}`)
    if(!response.ok){
        throw new Error('Failed to fetch users')
    }
    return response.json()
}

export const fetchUsers = async () => {
    const response = await fetch(`https://fakestoreapi.com/users/`)
    if(!response.ok){
        throw new Error('Failed to fetch users')
    }
    return response.json()
}

export const updateUser = async (userInfo) => {
    const response = await fetch(`https://fakestoreapi.com/users/${userInfo.userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    })
    if(!response.ok) {
        throw new Error('Failed to add new post')
    }
    return response.json();
}

export const deleteUser = async (userId) => {
    const response = await fetch(`https://fakestoreapi.com/users/${userId}`, {
        method: 'DELETE',
    })
    if(!response.ok){
        throw new Error('Failed to delete user')
    }
    return response.json()
}

export const fetchCategories = async () => {
    const response = await fetch(`https://fakestoreapi.com/products/categories`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const fetchProductsByCategory = async (category, page = 1, limit = 50, sortOrder = 'asc') => {
    const response = await fetch(`https://fakestoreapi.com/products/category/${category}?page=${page}&limit=${limit}&sort=${sortOrder}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

