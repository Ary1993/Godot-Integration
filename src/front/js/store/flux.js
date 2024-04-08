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
        //setStore({ wishes: data.results })
        setStore({ carts: data.results })
        localStorage.setItem("user", JSON.stringify(data.results))
        localStorage.setItem("wishes", JSON.stringify(data.results))
        localStorage.setItem("carts", JSON.stringify(data.results))
        setStore({ message: data.message })
        // grabar estos datos en el local storage
      },
      logout: () => {
        setStore({ isLogin: false });
        localStorage.removeItem("token")
      },
      addWishes: (newFavorite) => {
        const isUserLoggedIn = getStore().isLogin;
        //filtro update store
        setStore({wishes: [...getStore().wishes, newFavorite]});
        localStorage.setItem("wishes", JSON.stringify(getStore().wishes));
        if (isUserLoggedIn) {
          // User is logged in,update db post de wishes 
          
        } 
      },
      //25.3 41.11 , 44.44
      removeWishes: (item, array) => {
        setStore({ wishes: array.filter((element) => element != item) })
      },
      verifyLogin: () => {
        // aqui se verifica si alguien esta logeado
        // si el tokern existe en el local storage, quiere decir que esta logeado   
        if (localStorage.getItem("token")) {
          setStore({ isLogin: true })
          setStore({ user: JSON.parse(localStorage.getItem("user")) })
          setStore({ wishes: JSON.parse(localStorage.getItem("wishes")) })
          setStore({ cart: JSON.parse(localStorage.getItem("cart")) })
          //localStorage.setItem()
        }
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
