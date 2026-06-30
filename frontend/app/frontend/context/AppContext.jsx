// "use client"
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useState, useEffect } from "react";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext);
// }

// export const AppContextProvider = ({ children }) => {
//     const router = useRouter();

//     // Initialize state from localStorage if available
//     const [isCartOpen, setIsCartOpen] = useState(false);
//     const [cartItems, setCartItems] = useState([]);
//     const [wishlist, setWishlist] = useState([]);
//     const [isWishlistOpen, setIsWishlistOpen] = useState(false);
//     const [blogs, setBlogs] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [videos, setVideos] = useState([]);
//     // Load cart and wishlist from localStorage on component mount
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
//             setCartItems(savedCart);

//             const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//             setWishlist(savedWishlist);
//         }
//     }, []);

//     // Save to localStorage whenever cartItems or wishlist changes
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('cart', JSON.stringify(cartItems));
//         }
//     }, [cartItems]);

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('wishlist', JSON.stringify(wishlist));
//         }
//     }, [wishlist]);

//     const addToCart = (product, selectedVariant, quantity) => {
//         const imgPath = selectedVariant?.image || product?.thumbImg || "";
//         const imageUrl = imgPath
//             ? (String(imgPath).startsWith("http") ? String(imgPath) : `${process.env.NEXT_PUBLIC_BACKEND_URL}${imgPath}`)
//             : "/placeholder.png";

//         const cartItem = {
//             _id: product._id, // keep current cart page logic
//             id: product._id, // backward compatibility
//             slug: product.slug,
//             name: product.name,
//             image: imageUrl,
//             variant: selectedVariant,
//             quantity: quantity,
//             price: selectedVariant.discountPrice,
//             originalPrice: selectedVariant.price,
//             color: selectedVariant.color,
//             colorcode: selectedVariant.colorcode
//         };


//         let updatedCart = [...cartItems];
//         const existingItemIndex = updatedCart.findIndex(
//             item => (item._id || item.id) === product._id && item.color === selectedVariant.color
//         );

//         if (existingItemIndex >= 0) {
//             // Update quantity if item already in cart
//             updatedCart[existingItemIndex].quantity += quantity;
//         } else {
//             // Add new item to cart
//             updatedCart.push(cartItem);
//         }

//         setCartItems(updatedCart);
//         setIsCartOpen(true);
//     };

//     const removeFromCart = (itemId, color) => {
//         const updatedCart = cartItems.filter(
//             item => !(((item._id || item.id) === itemId) && item.color === color)
//         );
//         setCartItems(updatedCart);
//     };

//     const clearCart = () => {
//         setCartItems([]);
//     };

//     const getCartCount = () => {
//         return cartItems.reduce((total, item) => total + item.quantity, 0);
//     };

//     const updateCartItemQuantity = (itemId, color, newQuantity) => {
//         if (newQuantity < 1) return;

//         const updatedCart = cartItems.map(item => {
//             if ((item._id || item.id) === itemId && item.color === color) {
//                 return { ...item, quantity: newQuantity };
//             }
//             return item;
//         });

//         setCartItems(updatedCart);
//     };

//     const calculateCartTotal = () => {
//         return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//     };

//     const toggleWishlist = (product, variantIndex = 0) => {
//         setWishlist(prevWishlist => {
//             const isWishlisted = prevWishlist.some(item => item._id === product._id);
//             let updatedWishlist;

//             if (isWishlisted) {
//                 updatedWishlist = prevWishlist.filter(item => item._id !== product._id);
//             } else {
//                 updatedWishlist = [
//                     ...prevWishlist,
//                     { ...product, wishlistVariantIndex: variantIndex }
//                 ];
//             }

//             return updatedWishlist;
//         });


//     };

//     const isInWishlist = (productId) => {
//         return wishlist.some(item => item._id === productId);
//     };

//     const fetchVideos = async () => {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/listvideo`);
//             console.log("response", response);
//             if (response.data && Array.isArray(response.data.videos)) {
//                 console.log("videos", response.data.videos);
//                 setVideos(response.data.videos);
//             } else {
//                 setVideos([]);
//             }
//         } catch (error) {
//             console.error("Error fetching videos", error);
//             setVideos([]);
//         }
//     };

    


//     useEffect(() => {
//         fetchVideos();
//     }, []);


//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get`);
//             if (response.data && Array.isArray(response.data.products)) {
//                 console.log("products", response.data.products);
//                 setProducts(response.data.products);
//             } else {
//                 setProducts([]);
//             }
//         } catch (error) {
//             console.error("Error fetching products", error);
//             setProducts([]);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get`);
//             if (response.data && Array.isArray(response.data.categories)) {
//                 console.log("categories", response.data.categories);
//                 setCategories(response.data.categories);
//             } else {
//                 setCategories([]);
//             }
//         } catch (error) {
//             console.error("Error fetching categories", error);
//             setCategories([]);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchblogs = async () => {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog`);
//             if (response.data && Array.isArray(response.data)) {
//                 setBlogs(response.data);
//             } else {
//                 setBlogs([]);
//             }
//         } catch (error) {
//             console.error("Error fetching blogs", error);
//             setBlogs([]);
//         }
//     };

//     useEffect(() => {
//         fetchblogs();
//     }, []);



//     const value = {
//         router,
//         isCartOpen,
//         setIsCartOpen,
//         cartItems,
//         blogs,
//         videos,
//         setVideos,
//         setBlogs,
//         clearCart,
//         addToCart,
//         categories,
//         setCategories,
//         products,
//         setProducts,
//         getCartCount,
//         removeFromCart,
//         updateCartItemQuantity,
//         calculateCartTotal,
//         wishlist,
//         toggleWishlist,
//         wishlist, setWishlist,
//         isWishlistOpen, setIsWishlistOpen,
//         isInWishlist
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };






















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
            ? (String(imgPath).startsWith("http") ? String(imgPath) : `${process.env.NEXT_PUBLIC_BACKEND_URL}${imgPath}`)
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
            colorcode: selectedVariant.colorcode,
                stock: selectedVariant.stock || 0, // ← store stock here

        };


        let updatedCart = [...cartItems];
        const existingItemIndex = updatedCart.findIndex(
            item => (item._id || item.id) === product._id && item.color === selectedVariant.color
        );

         const maxAllowed = Math.min(selectedVariant.stock || 0, 30); // stock may be undefined
  let currentQty = 0;

        if (existingItemIndex >= 0) {
    currentQty = updatedCart[existingItemIndex].quantity;
    const newTotal = currentQty + quantity;
    const finalQty = Math.min(newTotal, maxAllowed);
    if (finalQty === currentQty) {
      // Already at max – optionally show a toast/message
      return;
    }
    updatedCart[existingItemIndex].quantity = finalQty;
  } else {
    // New item – add only up to maxAllowed
    const finalQty = Math.min(quantity, maxAllowed);
    if (finalQty <= 0) return; // prevent adding if stock is 0
    cartItem.quantity = finalQty;
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
    setIsCartOpen(false);
};

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const updateCartItemQuantity = (itemId, color, newQuantity) => {
  if (newQuantity < 1) return;

  const updatedCart = cartItems.map(item => {
    if ((item._id || item.id) === itemId && item.color === color) {
      const maxAllowed = Math.min(item.stock || 0, 30);
      const cappedQuantity = Math.min(newQuantity, maxAllowed);
      // If cappedQuantity equals current quantity, you might want to skip
      return { ...item, quantity: cappedQuantity };
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/listvideo`);
            console.log("response", response);
            if (response.data && Array.isArray(response.data.videos)) {
                console.log("videos", response.data.videos);
                setVideos(response.data.videos);
            } else {
                setVideos([]);
            }
        } catch (error) {
            console.error("Error fetching videos", error);
            setVideos([]);
        }
    };

    


    useEffect(() => {
        fetchVideos();
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get`);
            if (response.data && Array.isArray(response.data.products)) {
                console.log("products", response.data.products);
                setProducts(response.data.products);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products", error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get`);
            if (response.data && Array.isArray(response.data.categories)) {
                console.log("categories", response.data.categories);
                setCategories(response.data.categories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchblogs = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog`);
            if (response.data && Array.isArray(response.data)) {
                setBlogs(response.data);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error("Error fetching blogs", error);
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