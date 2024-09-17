// Login Store
import LoginEnum from '@/enums/login.enum';
import { defineStore } from 'pinia';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/utils/local-storage.utils';
import { LOCALSTORAGE_LOGIN_KEY } from '@/consts/login.const';

export const useLoginStore = defineStore('login', {
    state: () => ({
        isLoggedIn: getLocalStorage(LOCALSTORAGE_LOGIN_KEY) === LoginEnum.LOGIN
    }),

    actions: {
        login() {
            setLocalStorage(LOCALSTORAGE_LOGIN_KEY, LoginEnum.LOGIN);
            this.isLoggedIn = true;
        },
        logout() {
            removeLocalStorage(LOCALSTORAGE_LOGIN_KEY);
            this.isLoggedIn = false;
        }
    }
})
