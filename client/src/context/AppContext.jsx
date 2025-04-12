import { createContext, useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { dummyProducts } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [isSeller,setIsSeller] = useState(false); 
    const[showUserLogin,setShowUserLogin] = useState(false);
    const[products,setProducts] = useState([]);
    const [cartItems,setCartItems] = useState({});
   //fetch all products
    const fetchProducts = async () => {
        setProducts(dummyProducts)
    };

    //add Product to Cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Product added to cart ");
    }

    //remove Product from Cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
          cartData[itemId]-=1;
          if(cartData[itemId] === 0){
            delete cartData[itemId];
          }
        }
        setCartItems(cartData);
        toast.success("Product removed from cart ");
    }

    //update Product quantity in Cart
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
        toast.success("Product quantity updated in cart ");
    }






    useEffect(() => {
        fetchProducts();
    }, []);
    
    const value = {navigate, isSeller, setIsSeller, user, setUser, showUserLogin, setShowUserLogin, products ,currency,
             cartItems, addToCart, removeFromCart, updateCartItem
    };

    return <AppContext.Provider value={value}>
            {children}
         </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}