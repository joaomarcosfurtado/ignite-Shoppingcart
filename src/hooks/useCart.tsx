import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  
  
  const [cart, setCart] = useState<Product[]>(() => {
    
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return []
  });

  const addProduct = async (productId: number) => {
    try {
      const productInCart = cart.find(product => product.id === productId);
      
      const updatedCart = [...cart]

      const getProductStock = (await api.get(`stock/${productId}`)).data.amount
      
      if (productInCart) {
        if (getProductStock === productInCart.amount) {
          toast.error('Quantidade solicitada fora de estoque')
          return
        } 
      }  

      if (productInCart) {
        const productIncrement: UpdateProductAmount = {
          productId: productId,
          amount: productInCart.amount + 1,
        }
        
        updateProductAmount(productIncrement)
      } else {
        const getProductInfo = (await api.get(`products/${productId}`)).data
        
        const newProduct = {
          ...getProductInfo, 
          amount: 1,
        }

        updatedCart.push(newProduct);

        setCart(updatedCart);
       
      }

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))  
    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productInCart = cart.find(product => product.id === productId);

      if (!productInCart) {
        toast.error('Erro na remoção do produto')
        return
      }
      
      const deleteProduct = cart.filter(product => product.id !== productId);

      console.log(deleteProduct)

      setCart(deleteProduct)

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(deleteProduct))
      
    } catch {
      toast.error("Erro na remoção do produto")
    }
  };

    const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const getProductSotck = (await api.get(`/stock/${productId}`)).data.amount;
      
      if (getProductSotck >= amount && amount > 0) {
        const updatedCart = cart.map((product) => 
          product.id === productId ? {...product, amount: amount } : product  
          );  

        setCart(updatedCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
      } else {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      

    } catch {
      toast.error("Erro na alteração de quantidade do produto")
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
