import { MdAddShoppingCart } from "react-icons/md";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
  // onHandleAddProduct: (id: number) => void;
}

interface ProductProps {
  
}


export function ListProducts ({ 
  id, 
  title,
  price,
  image,
  priceFormatted,
  // onHandleAddProduct, 
}: ProductFormatted) {
  
  return (
    <li>
      <img src={image} alt={title} />
      <strong>{title}</strong>
      <span>{priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        // onClick={onHandleAddProduct(id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {/* {cartItemsAmount[product.id] || 0} */} 2
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  );
}