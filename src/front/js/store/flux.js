const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [{ title: "FIRST", background: "white", initial: "white" },
      { title: "SECOND", background: "white", initial: "white" }],
      isLogin: false,
      user: null,
      carts: null,
      products: [],
      wishes: [],
      details: [],
    },
    actions: {
      login: async (data) => {
        console.log(data);
        setStore({ isLogin: true });
        localStorage.setItem("token", data.access_token)
        setStore({ user: data.results })
        localStorage.setItem("user", JSON.stringify(data.results))
        await getActions().updateWishes(data);
        //setStore({ wishes: data.wishes })
        //localStorage.setItem("wishes", JSON.stringify(data.wishes))
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
          carts: null,
          // Any other state properties you might want to reset upon logout
        });
        localStorage.clear();
      },
      handleLogin: async (email, password) => {
        const dataToSend = {
          email: email,
          password: password
        }
        const url = process.env.BACKEND_URL + "/api/login"
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        }
        const response = await fetch(url, options);
        if (!response.ok) {
          console.log("error", response.status, response.statusText);
          return
        }
        const data = await response.json()
        await getActions().login(data);
      },
      updateWishes: async (data) => {
        // Retrieve wishes from local storage first
        const storedWishes = JSON.parse(localStorage.getItem("wishes"));
        // Check if there are no wishes to update, else deja lo que viene del back
        if (!storedWishes) {
          console.log("No stored wishes to update.");
          setStore({ wishes: data.wishes })
          localStorage.setItem("wishes", JSON.stringify(data.wishes))
          return;
        }
        // Assuming the logic to update wishes goes here...
        for (const wish of storedWishes) {
          // 1. Verifico si el wish ya esta en el back (data.wishes)
          //2. En caso en que este no tengo que ejecutar todo el fetch si no tengo volver al siguiente wish (ver continue)
          if (data.wishes.some(e => e.product_id === wish.product_id)) { // Use data.wishes instead of data
            console.log(`The wish for the product ${wish.product_id} is already registered.`);
            continue; // Skip to the next wish
          }
          const dataToSend = {

            "product_id": wish.product_id

          };
          const url = process.env.BACKEND_URL + "/api/wishes";
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(dataToSend)
          }
          const response = await fetch(url, options);
          if (!response.ok) {
            console.log("error", response.status, response.statusText)
            return
          }
          // Optionally, process response data, en este caso estamos actualizando todo y con el getWishes() traemos todos los serialized       
        }
        await getActions().getWishes();

      },

      // Function to toggle the favorite status of a product
      toggleFavorite: async (product) => {

        const isFavorite = getStore().wishes.filter(wish => wish.product_id === product.id);
        console.log(isFavorite);
        if (isFavorite.length === 0) {
          console.log("Igual a cero");
          await getActions().addWishes(product);
        } else {
          console.log("Distinto que cero");
          await getActions().removeWishes(isFavorite[0].id, product.id); // Assuming removeWishes accepts the product and the new array of wishes
        }
      },
      // Function to return the appropriate class for the heart icon
      getHeartClass: (product) => {
        return getStore().wishes.some(wish => wish.product_id == product.id) ? "fas fa-heart text-warning" : "far fa-heart";
      },
      addWishes: async (newFavorite) => {
        const isUserLoggedIn = getStore().isLogin;
        // Check if the wish is already in the local store to avoid duplicates
        let newWish = {
          id: null,
          product_id: newFavorite.id,
          name: newFavorite.name,
          image_url: newFavorite.image_url
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
          /*newWish = {
            id: data.results.id,
            product_id: newFavorite.id,
            name: newFavorite.name
          };
          console.log("Wish added", data);*/
          getActions().getWishes();
        } else {
          setStore({ wishes: [...getStore().wishes, newWish] });
          localStorage.setItem("wishes", JSON.stringify(getStore().wishes));
        }
      },
      //25.3 41.11 , 44.44
      removeWishes: async (wishId, productId) => {
        const isUserLoggedIn = getStore().isLogin;
        const store = getStore(); // Get the current state
        console.log(wishId);
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
          // Filter out the wish with the given ID
          let filterWishes = store.wishes.filter(wish => wish.product_id !== productId);
          setStore({ wishes: filterWishes })
          // Set the updated array back into local storage
          localStorage.setItem("wishes", JSON.stringify(store.wishes));
        } else {
          // Filter out the wish with the given ID
          let filterWishes = store.wishes.filter(wish => wish.product_id !== productId);
          setStore({ wishes: filterWishes })
          // Set the updated array back into local storage
          localStorage.setItem("wishes", JSON.stringify(store.wishes));
        }
      },
      getWishes: async () => {
        const url = process.env.BACKEND_URL + "/api/wishes"
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        };
        console.log(url);
        console.log(options);
        const response = await fetch(url, options);
        if (!response.ok) {
          console.log("Error en el fetch", response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Verificar la estructura de los datos
        let result = [];
        if (data && data.results) {
          for (let item of data.results) {
            if (item && item.product) {
              let wish = {
                id: item.wish_id, // id del deseo
                product_id: item.product.id, // id del producto
                name: item.product.name, // nombre del producto
                image_url: item.product.image_url, // URL de la imagen del producto
              };
              result.push(wish);
            }
          }
        } else {
          console.log("No se encontraron deseos");
        }
        setStore({ wishes: result });
        localStorage.setItem("wishes", JSON.stringify(result));
      },
      
      verifyLogin: () => {
        console.log("renderiza");
        // Verify Loggin : si el tokern existe en el local storage, quiere decir que esta logeado   
        if (!localStorage.getItem("token")) {
          if (localStorage.getItem("user")) {
            localStorage.removeItem("user");
          }
        } else {
          setStore({ isLogin: true })
          setStore({ user: JSON.parse(localStorage.getItem("user")) })

        }
        if (localStorage.getItem("wishes")) {
          setStore({ wishes: JSON.parse(localStorage.getItem("wishes")) })
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
        setStore({ products: data.results })
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
