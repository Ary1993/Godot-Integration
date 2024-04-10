const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [{ title: "FIRST", background: "white", initial: "white" },
      { title: "SECOND", background: "white", initial: "white" }],
      isLogin: false,
      user: null,
      carts: null,
      products: null,
      wishes: []
    },
    actions: {
      login: (data) => {
        console.log(data);
        setStore({ isLogin: true });
        setStore({ user: data.results })
        localStorage.setItem("user", JSON.stringify(data.results))
      },
      logout: () => {
        setStore({
          isLogin: false,
          wishes: [], // Reset wishes in the state
          user: null, // Consider also resetting the user info if needed
          // Any other state properties you might want to reset upon logout
        });
        localStorage.removeItem("token");
        localStorage.removeItem("wishes"); // Clear wishes from local storage
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
            product_id: wish.id
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
        const wishExists = getStore().wishes.some(wish => wish.id === newFavorite.id);
        if (wishExists) {
          console.log('Wish already exists in the store');
          return; // Stop execution if the wish already exists
        }
        //filtro update store
        setStore({ wishes: [...getStore().wishes, newFavorite] });
        localStorage.setItem("wishes", JSON.stringify(getStore().wishes));
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
          };

          const data = await response.json();
          console.log("Wish added", data);


        }
      },
      //25.3 41.11 , 44.44
      removeWishes: (item, array) => {
        setStore({ wishes: array.filter((element) => element != item) })
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
        else {
          setStore({ isLogin: true })
          setStore({ user: JSON.parse(localStorage.getItem("user")) })
          //localStorage.setItem()
          if (localStorage.getItem("wishes")) {
            setStore({ wishes: JSON.parse(localStorage.getItem("wishes")) })
          } else {
            setStore({ wishes: [] })
          }
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
