import { createSlice } from '@reduxjs/toolkit'

const savedInfoUser = JSON.parse(localStorage.getItem("infoUser")) || {};

export const authStore = createSlice({
  name: 'authStore',
  initialState: {
    infoUser  : {},
    isLogin   : savedInfoUser.isLogin == true ? true : false,
    token     : savedInfoUser.access,
    idrol     : savedInfoUser.idrol,
    name_user : '',
    email     : '',
  },
  reducers: {
    loginSuccess:(state,action) => {
        state.isLogin   = action.payload.islogin == false ? false : true
        state.token     = action.payload.token
        state.name_user = action.payload.name_user
        state.email     = action.payload.email
      },
      loginFail:(state,action) => {
        localStorage.removeItem("infoUser");
        state.infoUser  = {};
        state.isLogin   = false;
        state.token     = "";
        state.name_user = "";
        state.email     = "";
        state.idrol     = "";
      },
      setAuthenticated:(state, action) => {
          state.token     = action.payload.access
          console.log(" action.payload ", action.payload.idrol)
          
          let local = {"access"  : action.payload.access, 
                       "isLogin" : action.payload.islogin,
                       "idrol"   : action.payload.idrol};

          localStorage.setItem("infoUser",JSON.stringify(local));

          state.isLogin = action.payload.islogin === true ? true : false;
          state.idrol   = action.payload.idrol;

      }
  }
})

// Action creators are generated for each case reducer function
export const { setAuthenticated, loginSuccess,  loginFail } = authStore.actions;