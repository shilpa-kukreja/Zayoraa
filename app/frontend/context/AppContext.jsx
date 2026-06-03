"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = ({ children }) => {
    const router = useRouter();

    // Initialize state from localStorage if available
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [videos, setVideos] = useState([]);
    // Load cart and wishlist from localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(savedCart);

            const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishlist(savedWishlist);
        }
    }, []);

    // Save to localStorage whenever cartItems or wishlist changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist]);

    const addToCart = (product, selectedVariant, quantity) => {
        const imgPath = selectedVariant?.image || product?.thumbImg || "";
        const imageUrl = imgPath
            ? (String(imgPath).startsWith("http") ? String(imgPath) : `http://localhost:5000${imgPath}`)
            : "/placeholder.png";

        const cartItem = {
            _id: product._id, // keep current cart page logic
            id: product._id, // backward compatibility
            slug: product.slug,
            name: product.name,
            image: imageUrl,
            variant: selectedVariant,
            quantity: quantity,
            price: selectedVariant.discountPrice,
            originalPrice: selectedVariant.price,
            color: selectedVariant.color,
            colorcode: selectedVariant.colorcode
        };


        let updatedCart = [...cartItems];
        const existingItemIndex = updatedCart.findIndex(
            item => (item._id || item.id) === product._id && item.color === selectedVariant.color
        );

        if (existingItemIndex >= 0) {
            // Update quantity if item already in cart
            updatedCart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            updatedCart.push(cartItem);
        }

        setCartItems(updatedCart);
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId, color) => {
        const updatedCart = cartItems.filter(
            item => !(((item._id || item.id) === itemId) && item.color === color)
        );
        setCartItems(updatedCart);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const updateCartItemQuantity = (itemId, color, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map(item => {
            if ((item._id || item.id) === itemId && item.color === color) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCartItems(updatedCart);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const toggleWishlist = (product, variantIndex = 0) => {
        setWishlist(prevWishlist => {
            const isWishlisted = prevWishlist.some(item => item._id === product._id);
            let updatedWishlist;

            if (isWishlisted) {
                updatedWishlist = prevWishlist.filter(item => item._id !== product._id);
            } else {
                updatedWishlist = [
                    ...prevWishlist,
                    { ...product, wishlistVariantIndex: variantIndex }
                ];
            }

            return updatedWishlist;
        });


    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const fetchVideos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/videos/listvideo");
            console.log("response", response);
            if (response.data && Array.isArray(response.data.videos)) {
                console.log("videos", response.data.videos);
                setVideos(response.data.videos);
            } else {
                setVideos([]);
                setError("Invalid data format received from server");
            }
        } catch (error) {
            console.error("Error fetching videos", error);
            setError("Failed to load videos. Please try again later.");
            setVideos([]);
        }
    };

    


    useEffect(() => {
        fetchVideos();
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products/get");
            if (response.data && Array.isArray(response.data.products)) {
                console.log("products", response.data.products);
                setProducts(response.data.products);
            } else {
                setProducts([]);
                setError("Invalid data format received from server");
            }
        } catch (error) {
            console.error("Error fetching products", error);
            setError("Failed to load products. Please try again later.");
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/categories/get");
            if (response.data && Array.isArray(response.data.categories)) {
                console.log("categories", response.data.categories);
                setCategories(response.data.categories);
            } else {
                setCategories([]);
                setError("Invalid data format received from server");
            }
        } catch (error) {
            console.error("Error fetching categories", error);
            setError("Failed to load categories. Please try again later.");
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchblogs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/blog/getblog");
            if (response.data && Array.isArray(response.data)) {
                setBlogs(response.data);
            } else {
                setBlogs([]);
                setError("Invalid data format received from server");
            }
        } catch (error) {
            console.error("Error fetching blogs", error);
            setError("Failed to load blogs. Please try again later.");
            setBlogs([]);
        }
    };

    useEffect(() => {
        fetchblogs();
    }, []);



    const value = {
        router,
        isCartOpen,
        setIsCartOpen,
        cartItems,
        blogs,
        videos,
        setVideos,
        setBlogs,
        clearCart,
        addToCart,
        categories,
        setCategories,
        products,
        setProducts,
        getCartCount,
        removeFromCart,
        updateCartItemQuantity,
        calculateCartTotal,
        wishlist,
        toggleWishlist,
        wishlist, setWishlist,
        isWishlistOpen, setIsWishlistOpen,
        isInWishlist
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};