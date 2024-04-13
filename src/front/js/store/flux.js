const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [{ title: "FIRST", background: "white", initial: "white" },
      { title: "SECOND", background: "white", initial: "white" }],
      isLogin: false,
      user: null,
      cart: null,
      products: null,
      wishes: []
    },
    actions: {
      login: (data) => {
        console.log(data);
        setStore({ isLogin: true });
        setStore({ user: data.user })
        localStorage.setItem("user", JSON.stringify(data.user))
        setStore({ wishes: data.wishes })
        localStorage.setItem("wishes", JSON.stringify(data.wishes))
        setStore({ cart: data.cart })
        localStorage.setItem("cart", JSON.stringify(data.cart))
      },
      carts: (data) => {
        setStore({ isLogin: true });
        setStore({ carts: data.items })
        localStorage.setItem("carts", JSON.stringify(data.items))
      },
      logout: () => {
        setStore({
          isLogin: false,
          wishes: [], // Reset wishes in the state
          user: null, // Consider also resetting the user info if needed
          cart: null,
          // Any other state properties you might want to reset upon logout
        });
        localStorage.clear();
      },
      updateWishes: async () => {
        // Retrieve wishes from local storage first
        const storedWishes = JSON.parse(localStorage.getItem("wishes"));

        // Check if there are no wishes to update
        if (!storedWishes) {
          console.log("No stored wishes to update.");
          return;
        }

        // Assuming the logic to update wishes goes here...
        for (const wish of storedWishes) {
          // Example: update each wish in the backend
          const dataToSend = {
            product_id: wish.id.product_id
          };
          const response = await fetch(`${process.env.BACKEND_URL}/api/wishes`, {
            method: 'POST', // Or 'PUT', depending on your backend setup
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            console.log("error", response.status, response.statusText)
          }
          // Optionally, process response data
          const data = await response.json();
          console.log('Wish updated:', data);

        }
        // After updating, optionally refresh the list from the backend or update the local state as necessary
      },
      addWishes: async (newFavorite) => {
        const isUserLoggedIn = getStore().isLogin;
        // Check if the wish is already in the local store to avoid duplicates
        const wishExists = getStore().wishes.some(wish => wish.product_id === newFavorite.id);
        if (wishExists) {
          console.log('Wish already exists in the store');
          return; // Stop execution if the wish already exists
        }
        let newWish = {
          id: null,
          product_id: newFavorite.id,
          name: newFavorite.name
        };
        if (isUserLoggedIn) {
          //If User is logged Update db post wishes 
          const wishData = {
            product_id: newFavorite.id
          };
          const url = process.env.BACKEND_URL + "/api/wishes";

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(wishData)
          });

          if (!response.ok) {
            console.log("error", response.status, response.statusText)
            return
          };
          const data = await response.json();
          newWish = {
            id: data.results.id
          };
          console.log("Wish added", data);
        }
        setStore({ wishes: [...getStore().wishes, newWish] });
        localStorage.setItem("wishes", JSON.stringify(getStore().wishes));
      },
      //25.3 41.11 , 44.44
      removeWishes: async (wishId) => {
        const isUserLoggedIn = getStore().isLogin;
        const store = getStore(); // Get the current state

        if (isUserLoggedIn) {
          //If User is logged Update db post wishes 
          const url = process.env.BACKEND_URL + "/api/wishes/" + wishId;

          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
          });

          if (!response.ok) {
            console.log("error", response.status, response.statusText)
            return
          };
          const data = await response.json();
          console.log("Wish deleted", data);
        }
        console.log("Update local");
        // Get the current array of wishes from local storage
        let wishes = JSON.parse(localStorage.getItem("wishes")) || [];

        // Filter out the wish with the given ID
        wishes = wishes.filter(wish => wish.id !== wishId);

        // Set the updated array back into local storage
        localStorage.setItem("wishes", JSON.stringify(wishes));
      },
      verifyLogin: () => {
        if (!localStorage.getItem("user")) {
          localStorage.clear()
          return
        }

        // Verify Loggin : si el tokern existe en el local storage, quiere decir que esta logeado   
        if (!localStorage.getItem("token")) {
          localStorage.clear();
          return
        }
        if (!localStorage.getItem("user")) {
          localStorage.clear()
          return
        }
        else {
          setStore({ isLogin: true })
          setStore({ user: JSON.parse(localStorage.getItem("user")) })
          //localStorage.setItem()
        } 
          if (localStorage.getItem("wishes")) {
            setStore({ wishes: JSON.parse(localStorage.getItem("wishes")) })
          } {
            setStore({ wishes: [] })
          }
        //Preguntar como el cart igual que con wishes
        //setStore({ cart: JSON.parse(localStorage.getItem("cart")) })
      },
      getProducts: async () => {
        // aqui se obtiene los productos 
        const url = process.env.BACKEND_URL + "/api/products"
        const options = {
          method: "GET"
        };
        const response = await fetch(url, options)
        if (!response.ok) {

          console.log("Error en el fetch", response.status, response.statusText)
          return response.status
        }
        const data = await response.json()
        console.log(data)
        setStore({ products: data.results })
        //localStorage.setItem("products", JSON.stringify(data))
      },

      getWishes: async () => {
        // aqui se obtiene los productos 
        const url = process.env.BACKEND_URL + "/api/whishes"
        const options = {
          method: "GET"
        };
        const response = await fetch(url, options)
        if (!response.ok) {

          console.log("Error en el fetch", response.status, response.statusText)
          return response.status
        }
        const data = await response.json()
        console.log(data)
        setStore({ wishes: data.results })
        //localStorage.setItem("products", JSON.stringify(data))
      },
      setCart: (cartData) => {
        setStore({ carts: cartData });  // Establece el carrito en el estado global
        localStorage.setItem('carts', JSON.stringify(cartData));  // Opcionalmente, guarda el carrito en localStorage
      },

      removeItemFromCart: (itemId) => {
        const store = getStore();  // Obtiene el estado actual
        if (store.carts && store.carts.items) {
          const updatedItems = store.carts.items.filter(item => item.id !== itemId);  // Filtra el ítem que quieres remover
          const updatedCart = { ...store.carts, items: updatedItems };  // Crea un nuevo objeto de carrito con los ítems actualizados
          setStore({ carts: updatedCart });  // Actualiza el estado del carrito
          localStorage.setItem('carts', JSON.stringify(updatedCart));  // Actualiza el localStorage
        }
      },
      clearCart: () => {
        setStore({ carts: null });  // Esto establece el carrito a null, puedes ajustarlo según necesites
        localStorage.removeItem("carts");  // Elimina el carrito del almacenamiento local
      },
      setCartId: (cartId) => {
        setStore({ cartId });
      },
      // Use getActions to call a function within a fuction
      exampleFunction: () => { getActions().changeColor(0, "green"); },
      getMessage: async () => {
        try {
          // Fetching data from the backend
          const url = process.env.BACKEND_URL + "/api/hello";
          const options = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
          const response = await fetch(url, options)
          const data = await response.json()
          setStore({ message: data.message })
          return data;  // Don't forget to return something, that is how the async resolves
        } catch (error) {
          console.log("Error loading message from backend", error)
        }
      },
      changeColor: (index, color) => {
        const store = getStore();  // Get the store
        // We have to loop the entire demo array to look for the respective index and change its color
        const demo = store.demo.map((element, i) => {
          if (i === index) element.background = color;
          return element;
        });
        setStore({ demo: demo });  // Reset the global store
      }
    }
  };
};

export default getState;
